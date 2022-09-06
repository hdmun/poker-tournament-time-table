import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureMetaRepository } from './blind-structure-meta.repository';
import { BlindStructureRepository } from './blind-structure.repository';
import { BlindStructureDto } from './dto/blind-structure';
import { RegisterTournamentDto, TournamentDetailDto } from './dto/tournament';
import { BlindStructureMeta } from './entities/blind-structure-meta.entity';
import { BlindStructure } from './entities/blind-structure.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentRepository } from './tournament.repository';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger(TournamentService.name);

  constructor(
    private readonly blindStructureMetaRepo: BlindStructureMetaRepository,
    private readonly blindStructureRepo: BlindStructureRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async blindStructureTemplateAll() {
    return await this.blindStructureMetaRepo.find();
  }

  async blindStructureTemplate(id: number) {
    const template = await this.blindStructureMetaRepo.findOneBy({ id });
    if (!template) {
      return [];
    }

    return await this.blindStructureRepo.findBy({
      metaId: template.id,
    });
  }

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

  async tournamentAll() {
    return await this.tournamentRepository.find();
  }

  async tournamentBy(id: number): Promise<TournamentDetailDto> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    const structures = await this.blindStructureRepo.findBy({
      metaId: tournament.blindStructureId,
    });
    return {
      id: tournament.id,
      title: tournament.title,
      startDateTime: tournament.startDateTime,
      buyIn: tournament.buyIn,
      breakTime: tournament.breakTime,
      breakTimeTerm: tournament.breakTimeTerm,
      structures,
    };
  }

  async registerTournament(dto: RegisterTournamentDto) {
    const newTornament = Tournament.Create(
      dto.title,
      dto.startDateTime,
      dto.buyIn,
      dto.blindStructureId,
      dto.breakTime,
      dto.breakTimeTerm,
    );
    this.tournamentRepository.save(newTornament);
  }

  async deleteTournament(id: number) {
    const result = this.tournamentRepository.delete({ id });
    this.logger.log(result);
  }
}
