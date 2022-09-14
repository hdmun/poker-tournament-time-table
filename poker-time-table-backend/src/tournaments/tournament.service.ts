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
    const result = await this.tournamentRepository.delete({ id });
    this.logger.log(result);
  }

  async updateBlind(tournamentId: number, blinds: TournamentBlindDto[]) {
    // todo transaction
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });
    if (!tournament) {
      throw new Error(`[updateBlind] invalind tournament id, ${tournamentId}`);
    }

    const tournamentBlinds: TournamentBlind[] =
      await this.blindRepository.findBy({
        tournamentId: tournamentId,
      });

    // update, remove
    const removeBlinds: TournamentBlind[] = [];
    tournamentBlinds.forEach((blind, index) => {
      if (index >= blinds.length) {
        removeBlinds.push(blind);
        return;
      }

      const updateBlind = blinds[index];
      blind.level = updateBlind.level;
      blind.smallBlind = updateBlind.smallBlind;
      blind.bigBlind = updateBlind.bigBlind;
      blind.minute = updateBlind.minute;
    });

    const deleteCount = tournamentBlinds.length - blinds.length;
    if (removeBlinds.length > 0 && deleteCount > 0) {
      tournamentBlinds.splice(blinds.length, deleteCount);
    }

    for (const updateBlind of tournamentBlinds) {
      await this.blindRepository.update(
        {
          id: updateBlind.id,
          tournamentId: tournament.id,
        },
        updateBlind,
      );
    }

    for (const deleteBlind of removeBlinds) {
      await this.blindRepository.delete({
        id: deleteBlind.id,
        tournamentId: tournament.id,
      });
    }

    // add
    let blindId = tournamentBlinds.length - 1;
    const addBlinds = blinds
      .slice(tournamentBlinds.length)
      .map<TournamentBlind>((value) => {
        blindId += 1;
        return {
          id: blindId,
          tournamentId: tournament.id,
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        };
      });

    for (const insertBlind of addBlinds) {
      await this.blindRepository.insert(insertBlind);
    }

    return await this.blindRepository.findBy({
      tournamentId: tournament.id,
    });
  }

  async play(id: number) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalind tournament id, ${id}`);
    }

    if (tournament.startDateTime && !tournament.pauseTime) {
      throw new Error(
        `already playing tournment, ${tournament.title}, ${tournament.pauseTime}`,
      );
    }

    if (!tournament.startDateTime) {
      tournament.startDateTime = new Date();
      tournament.level = 0;
      tournament.levelStart = new Date();
    }

    tournament.pauseTime = null;
    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        pauseTime: tournament.pauseTime,
        startDateTime: tournament.startDateTime,
        level: tournament.level,
        levelStart: tournament.levelStart,
      },
    );

    return tournament;
  }

  async pause(id: number) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalid tournament id, ${id}`);
    }

    if (tournament.startDateTime && tournament.pauseTime) {
      throw new Error(
        `already pause tournment, ${tournament.title}, ${tournament.pauseTime}`,
      );
    }

    tournament.pauseTime = new Date();
    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        pauseTime: tournament.pauseTime,
      },
    );

    return tournament;
  }

  async downBlindLevel(id: number) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalid tournament id, ${id}`);
    }

    if (tournament.level === 0) {
      throw new Error(`do not prev tournament level`);
    }

    tournament.level -= 1;
    tournament.levelStart = new Date();

    if (tournament.pauseTime) {
      tournament.pauseTime = new Date();
    }

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        level: () => 'level - 1',
        levelStart: tournament.levelStart,
        pauseTime: tournament.pauseTime,
      },
    );

    return tournament;
  }

  async upBlindLevel(id: number) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalid tournament id, ${id}`);
    }

    const blinds = await this.blindRepository.findBy({
      tournamentId: id,
    });

    tournament.level += 1;
    if (blinds.length <= tournament.level) {
      throw new Error(
        `invalid tournament level: ${tournament.level}, blinds: ${blinds.length}`,
      );
    }

    tournament.levelStart = new Date();

    if (tournament.pauseTime) {
      tournament.pauseTime = new Date();
    }

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        level: () => 'level + 1',
        levelStart: tournament.levelStart,
        pauseTime: tournament.pauseTime,
      },
    );

    return tournament;
  }
}
