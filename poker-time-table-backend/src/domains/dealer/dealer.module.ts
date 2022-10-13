import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { TournamentRepository } from '../tournaments/tournament.repository';
import { DealerPlayLogRepository } from './dealer-play-log.repository';
import { DealerController } from './dealer.controller';
import { DealerRepository } from './dealer.repository';
import { DealerService } from './dealer.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      DealerPlayLogRepository,
      TournamentRepository,
    ]),
    TypeOrmExModule.forCustomRepository([DealerRepository]),
  ],
  providers: [DealerService],
  controllers: [DealerController],
})
export class DealerModule {}
