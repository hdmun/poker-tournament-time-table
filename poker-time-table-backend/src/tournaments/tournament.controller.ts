import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { RegisterTournamentDto } from './dto/tournament';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  private readonly logger = new Logger(TournamentController.name);

  constructor(private readonly tournamentService: TournamentService) {}

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
}
