import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { TournamentRepository } from './tournament.repository';
import { TournamentBlindRepository } from './tournament-blind.repository';
import { BlindStructureRepository } from '~/blind-structures/blind-structures.repository';
import { TournamentTimerService } from './tournament-timer.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BlindStructureRepository]),
    TypeOrmExModule.forCustomRepository([TournamentBlindRepository]),
    TypeOrmExModule.forCustomRepository([TournamentRepository]),
    ScheduleModule.forRoot(),
  ],
  providers: [TournamentService, TournamentTimerService],
  controllers: [TournamentController],
})
export class TournamentModule {}
