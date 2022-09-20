import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { TournamentRepository } from './tournament.repository';
import { TournamentBlindRepository } from './tournament-blind.repository';
import { BlindStructureRepository } from '~/blind-structures/blind-structures.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from './events/tournament.events';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BlindStructureRepository]),
    TypeOrmExModule.forCustomRepository([TournamentBlindRepository]),
    TypeOrmExModule.forCustomRepository([TournamentRepository]),
    ScheduleModule.forRoot(),
    EventsModule,
  ],
  providers: [TournamentService],
  controllers: [TournamentController],
})
export class TournamentModule {}
