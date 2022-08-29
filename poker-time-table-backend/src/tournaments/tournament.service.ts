import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureMetaRepository } from './blind-structure-meta.repository';
import { BlindStructureRepository } from './blind-structure.repository';
import { BlindStructureDto } from './dto/blind-structure';
import { BlindStructureMeta } from './entities/blind-structure-meta.entity';
import { BlindStructure } from './entities/blind-structure.entity';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger(TournamentService.name);

  constructor(
    private readonly blindStructureMetaRepo: BlindStructureMetaRepository,
    private readonly blindStructureRepo: BlindStructureRepository,
  ) {}

  async registerBlindStructure(
    name: string,
    structureDto: BlindStructureDto[],
  ) {
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
      return BlindStructure.create(
        regBlindMeta.id,
        value.level,
        value.smallBlind,
        value.bigBlind,
        value.minute,
      );
    });

    const retStructures = await this.blindStructureRepo.save(structures);
    this.logger.log(structures, retStructures);
  }
}
