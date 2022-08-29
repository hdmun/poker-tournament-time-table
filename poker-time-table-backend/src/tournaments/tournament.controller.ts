import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { RegisterBlindStructureDto } from './dto/blind-structure';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  private readonly logger = new Logger(TournamentController.name);

  constructor(private readonly tournamentService: TournamentService) {}

  @Post('/blind-structures-meta')
  async registerBlindStructures(@Body() dto: RegisterBlindStructureDto) {
    try {
      await this.tournamentService.registerBlindStructure(
        dto.name,
        dto.structures,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
