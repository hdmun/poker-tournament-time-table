import {
  TournamentDetailDto,
  TournamentDto,
  TournamentLogDto,
} from '../dto/tournament';
import { TournamentBlind } from '../entities/tournament-blind.entity';
import { Tournament } from '../entities/tournament.entity';
import { mapFromTournamentBlind } from './tournament-blind';

export function mapToTournament(dto: TournamentDto): Tournament {
  const entity = new Tournament();
  entity.id = dto.id;
  entity.title = dto.title;
  entity.startDateTime = dto.startDateTime;
  entity.endDateTime = dto.endDateTime;
  entity.buyIn = dto.buyIn;
  entity.level = dto.level;
  entity.levelStart = dto.levelStart;
  entity.pauseTime = dto.pauseTime;
  entity.pauseSeconds = dto.pauseSeconds;
  return entity;
}

export function mapFromTournament(entity: Tournament): TournamentDto {
  return {
    id: entity.id,
    title: entity.title,
    startDateTime: entity.startDateTime,
    endDateTime: entity.endDateTime,
    buyIn: entity.buyIn,
    level: entity.level,
    levelStart: entity.levelStart,
    pauseTime: entity.pauseTime,
    pauseSeconds: entity.pauseSeconds,
  };
}

export function mapFromTournamentDetail(
  tournament: Tournament,
  blinds: TournamentBlind[],
): TournamentDetailDto {
  return {
    id: tournament.id,
    title: tournament.title,
    startDateTime: tournament.startDateTime,
    endDateTime: tournament.endDateTime,
    buyIn: tournament.buyIn,
    blindId: tournament.level,
    structures: blinds.map((value) => {
      return mapFromTournamentBlind(value);
    }),
  };
}

export function mapToLogFromTournament(
  tournament: Tournament,
): TournamentLogDto {
  return {
    title: tournament.title,
    startDateTime: tournament.startDateTime,
    endDateTime: tournament.endDateTime,
  };
}
