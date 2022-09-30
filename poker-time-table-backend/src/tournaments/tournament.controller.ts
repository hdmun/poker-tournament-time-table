import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  TournamentCloseResponse,
  TournamentRegisterRequest,
  TournamentRegisterResponse,
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
  TournamentDto,
} from './dto/tournament';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  private readonly logger = new Logger(TournamentController.name);

  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async tournaments(): Promise<TournamentDto[]> {
    try {
      return await this.tournamentService.tournamentAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/:id')
  async tournamentsBy(@Param('id') id: number): Promise<TournamentDetailDto> {
    try {
      return await this.tournamentService.tournamentBy(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post()
  async registerTournament(
    @Body() dto: TournamentRegisterRequest,
  ): Promise<TournamentRegisterResponse> {
    try {
      return await this.tournamentService.registerTournament(dto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Delete('/:id')
  async deleteTournament(
    @Param('id') id: number,
  ): Promise<TournamentCloseResponse> {
    try {
      return await this.tournamentService.closeTournament(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/play')
  async play(@Param('id') id: number): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.play(id);
      if (clock === null) {
        return null;
      }
      return clock;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/pause')
  async pause(
    @Param('id') id: number,
  ): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.pause(id);
      if (clock === null) {
        return null;
      }
      return clock;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/blinds')
  async updateTournmentBlind(
    @Param('id') tournamentId: number,
    @Body() dto: TournamentBlindDto[],
  ): Promise<TournamentBlindDto[]> {
    try {
      return await this.tournamentService.updateBlind(tournamentId, dto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/blind/down')
  async blindDown(
    @Param('id') id: number,
  ): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.downBlindLevel(id);
      if (clock === null) {
        return null;
      }
      return clock;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:id/blind/up')
  async blindUp(
    @Param('id') id: number,
  ): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.upBlindLevel(id);
      console.log('blindUp', clock);
      if (clock === null) {
        return null;
      }
      return clock;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
