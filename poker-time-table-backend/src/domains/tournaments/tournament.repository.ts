import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { Tournament } from './entities/tournament.entity';

@CustomRepository(Tournament)
export class TournamentRepository extends Repository<Tournament> {}
