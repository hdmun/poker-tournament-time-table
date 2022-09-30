import { TournamentBlindDto } from '../dto/tournament';
import { TournamentBlind } from '../entities/tournament-blind.entity';

export function mapToTournamentBlind(
  tournamentId: number,
  id: number,
  dto: TournamentBlindDto,
): TournamentBlind {
  const entity = new TournamentBlind();
  entity.tournamentId = tournamentId;
  entity.id = id;
  entity.level = dto.level;
  entity.ante = dto.ante;
  entity.smallBlind = dto.smallBlind;
  entity.bigBlind = dto.bigBlind;
  entity.minute = dto.minute;
  return entity;
}

export function mapFromTournamentBlind(
  entity: TournamentBlind,
): TournamentBlindDto {
  return {
    level: entity.level,
    ante: entity.ante,
    smallBlind: entity.smallBlind,
    bigBlind: entity.bigBlind,
    minute: entity.minute,
  };
}
