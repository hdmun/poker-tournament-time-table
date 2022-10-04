import { Injectable, Logger } from '@nestjs/common';
import { BlindStructureRepository } from '~/domains/blind-structures/blind-structures.repository';
import { InvalidInputError } from '~/common/exceptions';
import {
  TournamentCloseResponse,
  TournamentRegisterRequest,
  TournamentRegisterResponse,
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
  TournamentDto,
  TournamentDeleteResponse,
} from './dto/tournament';
import { TournamentBlind } from './entities/tournament-blind.entity';
import { Tournament } from './entities/tournament.entity';
import { EventService } from './events/tournament.events.service';
import {
  mapFromTournament,
  mapFromTournamentDetail,
} from './mapper/tournament';
import { mapToTournamentBlind } from './mapper/tournament-blind';
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

  async tournamentAll(): Promise<TournamentDto[]> {
    const tounaments = await this.tournamentRepository.find();
    return tounaments.map<TournamentDto>((tournament: Tournament) => {
      return mapFromTournament(tournament);
    });
  }

  async tournamentBy(id: number): Promise<TournamentDetailDto> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    const blinds = await this.blindRepository.findBy({
      tournamentId: id,
    });
    return mapFromTournamentDetail(tournament, blinds);
  }

  async registerTournament(
    dto: TournamentRegisterRequest,
  ): Promise<TournamentRegisterResponse> {
    const newTornament = Tournament.Create(dto.title, dto.buyIn);
    await this.tournamentRepository.save(newTornament);

    const templateStructure = await this.blindStructureRepository.findBy({
      metaId: dto.blindStructureId,
    });

    const newTornamentBlinds: TournamentBlind[] = [];
    for (const blindDto of templateStructure) {
      let blindId = newTornamentBlinds.length;
      newTornamentBlinds.push(
        mapToTournamentBlind(newTornament.id, blindId, blindDto),
      );

      const isAddBreakTime = blindDto.level % dto.breakTimeTerm;
      if (isAddBreakTime === 0) {
        blindId = newTornamentBlinds.length;
        newTornamentBlinds.push(
          TournamentBlind.createBreakTime(
            newTornament.id,
            blindId,
            dto.breakTime,
          ),
        );
      }
    }
    await this.blindRepository.save(newTornamentBlinds);

    return {
      tournament: newTornament,
      blinds: newTornamentBlinds,
    };
  }

  async deleteTournament(
    tournamentId: number,
  ): Promise<TournamentDeleteResponse> {
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });
    if (!tournament) {
      throw new InvalidInputError(
        `잘못된 토너먼트 'id'로 요청했습니다. ${tournamentId}`,
      );
    }

    await this.tournamentRepository.delete({ id: tournament.id });

    return {
      tournamentId,
    };
  }

  async closeTournament(
    tournamentId: number,
  ): Promise<TournamentCloseResponse> {
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });
    if (!tournament) {
      throw new InvalidInputError(
        `잘못된 토너먼트 'id'로 요청했습니다. ${tournamentId}`,
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
      throw new InvalidInputError(
        `잘못된 토너먼트 'id'로 요청했습니다. ${tournamentId}`,
      );
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
      return mapToTournamentBlind(tournament.id, blindId, value);
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
      throw new InvalidInputError(`잘못된 토너먼트 'id'로 요청했습니다. ${id}`);
    }

    if (tournament.startDateTime && !tournament.pauseTime) {
      throw new InvalidInputError(
        `이미 실행중인 토너먼트 입니다. '${tournament.title}'`,
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
      throw new InvalidInputError(`잘못된 토너먼트 'id'로 요청했습니다. ${id}`);
    }

    if (tournament.startDateTime && tournament.pauseTime) {
      throw new InvalidInputError(
        `이미 일시정지된 토너먼트 입니다. '${tournament.title}'`,
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
      throw new InvalidInputError(`잘못된 토너먼트 'id'로 요청했습니다. ${id}`);
    }

    if (tournament.level === 0) {
      throw new InvalidInputError(
        `블라인드 레벨을 낮출 수 없습니다. 시작 블라인드입니다. level: ${tournament.level}`,
      );
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
      throw new InvalidInputError(`잘못된 토너먼트 'id'로 요청했습니다. ${id}`);
    }

    const blinds = await this.blindRepository.findBy({
      tournamentId: id,
    });

    tournament.level += 1;
    if (blinds.length <= tournament.level) {
      throw new InvalidInputError(
        `블라인드 레벨을 올릴 수 없습니다. 마지막 블라인드입니다. level: ${tournament.level}`,
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
