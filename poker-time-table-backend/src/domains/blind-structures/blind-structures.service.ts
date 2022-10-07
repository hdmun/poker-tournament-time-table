import { Injectable, Logger } from '@nestjs/common';
import { DuplicateKeyError, InvalidInputError } from '~/common/exceptions';
import { BlindStructureMetaRepository } from './blind-structures-meta.repository';
import { BlindStructureRepository } from './blind-structures.repository';
import {
  BlindStructureDto,
  BlindTemplateMetaResponse,
} from './dto/blind-structure';
import { BlindStructureMeta } from './entities/blind-structure-meta.entity';
import { BlindStructure } from './entities/blind-structure.entity';
import {
  mapFromBlindStructure,
  mapToBlindStructure,
} from './mapper/blind-structure';

@Injectable()
export class BlindStructureService {
  private readonly logger = new Logger(BlindStructureService.name);

  constructor(
    private readonly blindStructureMetaRepo: BlindStructureMetaRepository,
    private readonly blindStructureRepo: BlindStructureRepository,
  ) {}

  async getTemplateAll(): Promise<BlindTemplateMetaResponse[]> {
    const templates = await this.blindStructureMetaRepo.find();
    return templates.map<BlindTemplateMetaResponse>((value) => {
      return {
        id: value.id,
        name: value.name,
      };
    });
  }

  async getTemplate(id: number): Promise<BlindStructureDto[]> {
    const template = await this.blindStructureMetaRepo.findOneBy({ id });
    if (!template) {
      return [];
    }

    const blindTemplate = await this.blindStructureRepo.findBy({
      metaId: template.id,
    });

    return blindTemplate.map<BlindStructureDto>((value) => {
      return mapFromBlindStructure(value);
    });
  }

  async registerBlindStructure(
    name: string,
    structureDto: BlindStructureDto[],
  ): Promise<void> {
    this.logger.log(
      `registerBlindStructure, name: ${name}, blinds: ${structureDto.length}`,
    );

    const meta = await this.blindStructureMetaRepo.getByMetaName(name);
    if (meta) {
      this.logger.error(`duplicated blind template name '${name}', ${meta}`);
      throw new DuplicateKeyError(
        `블라인드 템플릿 '${name}'이 이미 존재합니다.`,
      );
    }

    const regBlindMeta = BlindStructureMeta.create(name);
    const retRegBlindMeta = await this.blindStructureMetaRepo.save(
      regBlindMeta,
    );

    this.logger.log(regBlindMeta, retRegBlindMeta);

    const structureCount = await this.blindStructureRepo.countBy({
      metaId: regBlindMeta.id,
    });
    if (structureCount > 0) {
      // remove
      this.logger.log(
        `remove, metaId: '${regBlindMeta.id}', structureCount: ${structureCount}`,
      );
    }

    const structures = structureDto.map<BlindStructure>((value) => {
      return mapToBlindStructure(regBlindMeta.id, value);
    });

    const retStructures = await this.blindStructureRepo.save(structures);
    this.logger.log(structures, retStructures);
  }

  async updateBlindStructure(
    id: number,
    name: string,
    structureDto: BlindStructureDto[],
  ): Promise<void> {
    this.logger.log(
      `updateBlindStructure, name: ${name}, id: ${id}, blinds: ${structureDto.length}`,
    );

    const meta = await this.blindStructureMetaRepo.findOneBy({ id });
    if (!meta) {
      throw new InvalidInputError(
        `존재하지 않는 블라인드 템플릿입니다. id: ${id}, name: ${name}`,
      );
    }

    const structures = await this.blindStructureRepo.findBy({
      metaId: meta.id,
    });
    if (!structures) {
      throw new InvalidInputError(
        `블라인드 스트럭처가 비어있습니다. id: ${id}, name: ${name}`,
      );
    }

    if (meta.name !== name) {
      meta.name = name;
      await this.blindStructureMetaRepo.update({ id }, meta);
    }

    const diffCount = structures.length - structureDto.length;
    if (diffCount > 0) {
      const delIndex = structures.length - diffCount;
      const deleteStructure = structures.slice(delIndex);
      this.blindStructureRepo.remove(deleteStructure);
    }
    await this.blindStructureRepo.save(
      structureDto.map<BlindStructure>((value) => {
        return mapToBlindStructure(meta.id, value);
      }),
    );
  }

  async deleteBy(templateId: number): Promise<void> {
    this.logger.log(`deleteBy, templateId: ${templateId}`);

    const resStructure = await this.blindStructureRepo.delete({
      metaId: templateId,
    });
    const resStructureMeta = await this.blindStructureMetaRepo.delete({
      id: templateId,
    });

    if (resStructure.affected === 0 || resStructureMeta.affected === 0) {
      // todo
    }
  }
}
