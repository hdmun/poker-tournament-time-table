import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { DealerService } from './dealer.service';
import {
  DealerDto,
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
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
}
