import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { Dealer } from './entities/dealer.entity';

@CustomRepository(Dealer)
export class DealerRepository extends Repository<Dealer> {}
