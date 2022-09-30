import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureRepository } from '~/blind-structures/blind-structures.repository';
import {
  CloseTournamentResponseDto,
  RegisterTournamentDto,
  RegisterTournamentResponseDto,
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
} from './dto/tournament';
import { TournamentBlind } from './entities/tournament-blind.entity';
import { Tournament } from './entities/tournament.entity';
import { EventService } from './events/tournament.events.service';
import { TournamentBlindRepository } from './tournament-blind.repository';
import { TournamentRepository } from './tournament.repository';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger(TournamentService.name);

  constructor(
    private readonly blindStructureRepository: BlindStructureRepository,
    private readonly eventService: EventService,
    private readonly blindRepository: TournamentBlindRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async tournamentAll(): Promise<Tournament[]> {
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
      blindId: tournament.level,
      structures: blinds.map((value) => {
        return {
          level: value.level,
          ante: value.ante,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        };
      }),
    };
  }

  async registerTournament(
    dto: RegisterTournamentDto,
  ): Promise<RegisterTournamentResponseDto> {
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
        ante: value.ante,
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
          ante: 0,
          smallBlind: -1,
          bigBlind: -1,
          minute: dto.breakTime,
        });
      }
    });
    await this.blindRepository.save(newTornamentBlinds);

    return {
      tournament: newTornament,
      blinds: newTornamentBlinds,
    };
  }

  async closeTournament(
    tournamentId: number,
  ): Promise<CloseTournamentResponseDto> {
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });
    if (!tournament) {
      throw new Error(
        `[closeTournament] invalind tournament id, ${tournamentId}`,
      );
    }

    const endDateTime = new Date();
    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        endDateTime,
      },
    );

    return {
      tournamentId,
      endDateTime,
    };
  }

  async updateBlind(
    tournamentId: number,
    blinds: TournamentBlindDto[],
  ): Promise<TournamentBlind[]> {
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

    for (const blind of tournamentBlinds) {
      await this.blindRepository.delete({ id: blind.id, tournamentId });
    }

    let blindId = -1;
    const addBlinds = blinds.map<TournamentBlind>((value) => {
      blindId += 1;
      return {
        tournamentId: tournament.id,
        id: blindId,
        level: value.level,
        ante: value.ante,
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

  async play(id: number): Promise<TournamentClockEventDto | null> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalind tournament id, ${id}`);
    }

    if (tournament.startDateTime && !tournament.pauseTime) {
      throw new Error(
        `already playing tournment, ${tournament.title}, ${tournament.pauseTime}`,
      );
    }

    const nowDate = new Date();
    nowDate.setSeconds(nowDate.getSeconds() + 1);
    if (!tournament.startDateTime) {
      tournament.startDateTime = nowDate;
      tournament.level = 0;
      tournament.levelStart = nowDate;
    }

    let pauseSeconds = 0;
    if (tournament.pauseTime) {
      const pauseTime = nowDate.getTime() - tournament.pauseTime.getTime();
      pauseSeconds = pauseTime / 1000;
    }

    this.logger.log(
      `play tournament, id: ${id}, pauseSeconds: ${pauseSeconds}`,
    );

    tournament.pauseTime = null;

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        startDateTime: tournament.startDateTime,
        level: tournament.level,
        levelStart: tournament.levelStart,
        pauseTime: tournament.pauseTime,
        pauseSeconds: () => `pause_seconds + ${pauseSeconds}`,
      },
    );

    return await this.eventService.calcClock(tournament.id);
  }

  async pause(id: number): Promise<TournamentClockEventDto | null> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalid tournament id, ${id}`);
    }

    if (tournament.startDateTime && tournament.pauseTime) {
      throw new Error(
        `already pause tournment, ${tournament.title}, ${tournament.pauseTime}`,
      );
    }

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        pauseTime: new Date(),
      },
    );

    return await this.eventService.calcClock(tournament.id);
  }

  async downBlindLevel(id: number): Promise<TournamentClockEventDto | null> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new Error(`invalid tournament id, ${id}`);
    }

    if (tournament.level === 0) {
      throw new Error(`do not prev tournament level`);
    }

    tournament.level -= 1;

    const levelStartDate = new Date();
    levelStartDate.setSeconds(levelStartDate.getSeconds() + 1);
    tournament.levelStart = levelStartDate;

    if (tournament.pauseTime) {
      tournament.pauseTime = levelStartDate;
    }

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        level: () => 'level - 1',
        levelStart: tournament.levelStart,
        pauseTime: tournament.pauseTime,
        pauseSeconds: 0,
      },
    );

    return await this.eventService.calcClock(tournament.id);
  }

  async upBlindLevel(id: number): Promise<TournamentClockEventDto | null> {
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

    const levelStartDate = new Date();
    levelStartDate.setSeconds(levelStartDate.getSeconds() + 1);
    tournament.levelStart = levelStartDate;

    if (tournament.pauseTime) {
      tournament.pauseTime = levelStartDate;
    }

    await this.tournamentRepository.update(
      { id: tournament.id },
      {
        level: () => 'level + 1',
        levelStart: tournament.levelStart,
        pauseTime: tournament.pauseTime,
        pauseSeconds: 0,
      },
    );

    return await this.eventService.calcClock(tournament.id);
  }
}
