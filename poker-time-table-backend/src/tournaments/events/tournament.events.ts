import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { TournamentBlindRepository } from '../tournament-blind.repository';
import { TournamentRepository } from '../tournament.repository';
import { EventGateway } from './tournament.events.gateway';
import { EventService } from './tournament.events.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TournamentBlindRepository]),
    TypeOrmExModule.forCustomRepository([TournamentRepository]),
  ],
  providers: [EventGateway, EventService],
})
export class EventsModule {}
