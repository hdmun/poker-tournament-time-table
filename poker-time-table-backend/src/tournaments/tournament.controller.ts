import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { RegisterBlindStructureDto } from './dto/blind-structure';
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

  @Get('/blind-structure-templates')
  async blindStructureTemplates() {
    try {
      return await this.tournamentService.blindStructureTemplateAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/blind-structure-templates/:id')
  async blindTemplatesStructure(@Param('id') id: number) {
    try {
      return await this.tournamentService.blindStructureTemplate(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/blind-structures-meta')
  async registerBlindStructures(@Body() dto: RegisterBlindStructureDto) {
    try {
      await this.tournamentService.registerBlindStructure(
        dto.name,
        dto.structures,
      );
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
