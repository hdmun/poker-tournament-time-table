import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InvalidInputError } from '~/common/exceptions';
import { DealerService } from './dealer.service';
import {
  GetDealerLogResponse,
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
  UpdateDealerRequest,
  UpdateDealerResponse,
} from './dto/dealer';
import { DealerPlayLog } from './entities/dealer-play-log.entity';
import { mapToResponseFromPlayLogDto } from './mapper/dealer';

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

  @Get('/logs/:year/:month/:day')
  async logByDate(
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
  ): Promise<GetDealerLogResponse[]> {
    this.logger.log(`tournamentsByDate, ${year}/${month}/${day}`);
    try {
      const hours = 6; // 새벽에 시작하는 경우도 있으니 오전 6시를 기준으로 잡자
      const start = new Date(year, month - 1, day, hours, 0, 0, 0);

      const end = new Date(start.valueOf());
      end.setDate(start.getDate() + 1); // 하루만 조회

      const logs = await this.dealerService.getLogByDate(start, end);
      return logs.map<GetDealerLogResponse>((value) => {
        return mapToResponseFromPlayLogDto(value);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
