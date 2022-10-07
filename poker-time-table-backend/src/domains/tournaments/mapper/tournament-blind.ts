import { TournamentBlindDto } from '../dto/tournament';
import { TournamentBlind } from '../entities/tournament-blind.entity';

export function mapToTournamentBlind(
  tournamentId: number,
  blindId: number,
  dto: TournamentBlindDto,
): TournamentBlind {
  return TournamentBlind.create(
    tournamentId,
    blindId,
    dto.level,
    dto.ante,
    dto.smallBlind,
    dto.bigBlind,
    dto.minute,
  );
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
