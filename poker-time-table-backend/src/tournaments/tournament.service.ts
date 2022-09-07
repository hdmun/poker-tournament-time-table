import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureRepository } from '~/blind-structures/blind-structures.repository';
import {
  RegisterTournamentDto,
  TournamentBlindDto,
  TournamentDetailDto,
} from './dto/tournament';
import { TournamentBlind } from './entities/tournament-blind.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentBlindRepository } from './tournament-blind.repository';
import { TournamentRepository } from './tournament.repository';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger(TournamentService.name);

  constructor(
    private readonly blindStructureRepository: BlindStructureRepository,
    private readonly blindRepository: TournamentBlindRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async tournamentAll() {
    return await this.tournamentRepository.find();
  }

  async tournamentBy(id: number): Promise<TournamentDetailDto> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    const blinds = await this.blindRepository.findBy({
      tournamentId: id,
    });
    return {
      id: tournament.id,
      title: tournament.title,
      startDateTime: tournament.startDateTime,
      endDateTime: tournament.endDateTime,
      buyIn: tournament.buyIn,
      structures: blinds.map((value) => {
        return {
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        };
      }),
    };
  }

  async registerTournament(dto: RegisterTournamentDto) {
    const newTornament = Tournament.Create(dto.title, dto.buyIn);
    await this.tournamentRepository.save(newTornament);

    const templateStructure = await this.blindStructureRepository.findBy({
      metaId: dto.blindStructureId,
    });

    const newTornamentBlinds: TournamentBlind[] = [];
    templateStructure.forEach((value) => {
      newTornamentBlinds.push({
        id: newTornamentBlinds.length,
        tournamentId: newTornament.id,
        level: value.level,
        smallBlind: value.smallBlind,
        bigBlind: value.bigBlind,
        minute: value.minute,
      });

      const isAddBreakTime = value.level % dto.breakTimeTerm;
      if (isAddBreakTime === 0) {
        newTornamentBlinds.push({
          id: newTornamentBlinds.length,
          tournamentId: newTornament.id,
          level: -1,
          smallBlind: -1,
          bigBlind: -1,
          minute: dto.breakTime,
        });
      }
    });
    await this.blindRepository.save(newTornamentBlinds);
  }

  async deleteTournament(id: number) {
    const result = this.tournamentRepository.delete({ id });
    this.logger.log(result);
  }
}
