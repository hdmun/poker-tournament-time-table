import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { TournamentClockEventDto } from '../dto/tournament';
import { EventService } from './tournament.events.service';

@Injectable()
@WebSocketGateway({ path: '/tournaments/events' })
export class EventGateway {
  constructor(private readonly eventService: EventService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('clock')
  onClock(): Observable<WsResponse<TournamentClockEventDto>> {
    return this.eventService.subjects.pipe(
      map((clock) => ({ event: `clock-${clock.tournamentId}`, data: clock })),
    );
  }
}
