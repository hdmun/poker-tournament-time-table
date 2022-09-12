import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Sse,
} from '@nestjs/common';
import { interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RegisterTournamentDto } from './dto/tournament';
import { TournamentTimerService } from './tournament-timer.service';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  private readonly logger = new Logger(TournamentController.name);

  constructor(
    private readonly timerService: TournamentTimerService,
    private readonly tournamentService: TournamentService,
  ) {}

  @Get()
  async tournaments() {
    try {
      return await this.tournamentService.tournamentAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/:id')
  async tournamentsBy(@Param('id') id: number) {
    try {
      return await this.tournamentService.tournamentBy(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post()
  async registerTournament(@Body() dto: RegisterTournamentDto) {
    try {
      await this.tournamentService.registerTournament(dto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id')
  async updateTournment() {
    try {
      // await this.tournamentService.registerTournament(dto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/play')
  async play(@Param('id') id: number) {
    try {
      const result = await this.tournamentService.play(id);
      return {
        startDateTime: result.startDateTime,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/pause')
  async pause(@Param('id') id: number) {
    try {
      await this.tournamentService.pause(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/blind/down')
  async blindDown(@Param('id') id: number) {
    try {
      await this.tournamentService.downBlindLevel(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/blind/up')
  async blindUp(@Param('id') id: number) {
    try {
      await this.tournamentService.upBlindLevel(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Sse('/clock/:id')
  async clockTimer(@Param('id') id: number) {
    return interval(1000).pipe(
      switchMap(() => this.timerService.calcClock(id)),
      map((clock) => ({
        data: clock,
      })),
    );
  }
}
