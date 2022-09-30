import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  BlindStructureDto,
  BlindTemplateMetaResponse,
  BlindStructureRegisterRequest,
  BlindStructureUpdateRequest,
} from './dto/blind-structure';
import { BlindStructureService } from './blind-structures.service';
import { BlindStructure } from './entities/blind-structure.entity';

@Controller('blind-structures')
export class BlindStructureController {
  private readonly logger = new Logger(BlindStructureController.name);

  constructor(private readonly blindStructureService: BlindStructureService) {}

  @Get('/templates')
  async blindStructureTemplates(): Promise<BlindTemplateMetaResponse[]> {
    try {
      return await this.blindStructureService.getTemplateAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/templates/:id')
  async blindTemplatesStructure(
    @Param('id') id: number,
  ): Promise<BlindStructureDto[]> {
    try {
      return await this.blindStructureService.getTemplate(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/meta')
  async registerBlindStructures(
    @Body() dto: BlindStructureRegisterRequest,
  ): Promise<void> {
    try {
      await this.blindStructureService.registerBlindStructure(
        dto.name,
        dto.structures,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/meta')
  async updateBlindStructures(
    @Body() dto: BlindStructureUpdateRequest,
  ): Promise<void> {
    try {
      await this.blindStructureService.updateBlindStructure(
        dto.id,
        dto.name,
        dto.structures,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
