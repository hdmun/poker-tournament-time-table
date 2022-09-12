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
  RegisterBlindStructureDto,
  UpdateBlindStructureDto,
} from './dto/blind-structure';
import { BlindStructureService } from './blind-structures.service';

@Controller('blind-structures')
export class BlindStructureController {
  private readonly logger = new Logger(BlindStructureController.name);

  constructor(private readonly blindStructureService: BlindStructureService) {}

  @Get('/templates')
  async blindStructureTemplates() {
    try {
      return await this.blindStructureService.getTemplateAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/templates/:id')
  async blindTemplatesStructure(@Param('id') id: number) {
    try {
      return await this.blindStructureService.getTemplate(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/meta')
  async registerBlindStructures(@Body() dto: RegisterBlindStructureDto) {
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
  async updateBlindStructures(@Body() dto: UpdateBlindStructureDto) {
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