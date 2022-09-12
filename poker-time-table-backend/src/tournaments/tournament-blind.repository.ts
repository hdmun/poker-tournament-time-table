import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { TournamentBlind } from './entities/tournament-blind.entity';

@CustomRepository(TournamentBlind)
export class TournamentBlindRepository extends Repository<TournamentBlind> {}
