import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Put,
} from '@nestjs/common';
import { InvalidInputError } from '~/common/exceptions';
import { DealerService } from './dealer.service';
import {
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
  UpdateDealerRequest,
  UpdateDealerResponse,
} from './dto/dealer';

@Controller('dealers')
export class DealerController {
  private logger: Logger = new Logger(DealerController.name);

  constructor(private readonly dealerService: DealerService) {}

  @Get()
  async all(): Promise<GetDealersResponse> {
    try {
      const dealersAll = await this.dealerService.all();
      return {
        dealers: dealersAll,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post()
  async register(
    @Body() dto: RegisterDealerRequest,
  ): Promise<RegisterDealerResponse> {
    try {
      return await this.dealerService.register(dto.name);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Put('/:delaerId/')
  async update(
    @Body() dto: UpdateDealerRequest,
  ): Promise<UpdateDealerResponse> {
    try {
      const result = await this.dealerService.update(
        dto.dealerId,
        dto.tournamentId,
      );
      return {
        dealerId: result.dealerId,
        dealerName: result.dealerName,
        tournamentId: result.tournamentId,
        tournamentTitle: result.tournamentTitle,
        sitInTime: result.sitInTime?.toString(),
      };
    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.error(error);
      throw error;
    }
  }
}
