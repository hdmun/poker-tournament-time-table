import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureMetaRepository } from './blind-structures-meta.repository';
import { BlindStructureRepository } from './blind-structures.repository';
import {
  BlindStructureDto,
  BlindTemplateMetaResponse,
} from './dto/blind-structure';
import { BlindStructureMeta } from './entities/blind-structure-meta.entity';
import { BlindStructure } from './entities/blind-structure.entity';
import { mapToBlindStructure } from './mapper/blind-structure';

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
      return {
        level: value.level,
        ante: value.ante,
        smallBlind: value.smallBlind,
        bigBlind: value.bigBlind,
        minute: value.minute,
      };
    });
  }

  async registerBlindStructure(
    name: string,
    structureDto: BlindStructureDto[],
  ): Promise<void> {
    const meta = await this.blindStructureMetaRepo.getByMetaName(name);
    if (meta) {
      this.logger.error(`duplicated '${name}', ${meta}`);
      return;
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

    const structures = structureDto.map((value) => {
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
    const meta = await this.blindStructureMetaRepo.findOneBy({ id });
    if (!meta) {
      throw new Error(`invalid blind template, id: ${id}, name: ${name}`);
    }

    if (meta.name !== name) {
      meta.name = name;
      await this.blindStructureMetaRepo.update({ id }, meta);
    }

    const structures = await this.blindStructureRepo.findBy({
      metaId: meta.id,
    });

    if (!structures) {
      throw new Error(
        `emtpy blind template structure, id: ${id}, name: ${name}`,
      );
    }

    const diffCount = structures.length - structureDto.length;
    if (diffCount > 0) {
      const delIndex = structures.length - diffCount;
      const deleteStructure = structures.slice(delIndex);
      this.blindStructureRepo.remove(deleteStructure);
    }
    await this.blindStructureRepo.save(
      structureDto.map((value) => {
        return BlindStructure.create(
          meta.id,
          value.level,
          value.ante,
          value.smallBlind,
          value.bigBlind,
          value.minute,
        );
      }),
    );
  }
}
