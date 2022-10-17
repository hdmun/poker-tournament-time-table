import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InvalidInputError } from '~/common/exceptions';
import {
  TournamentCloseResponse,
  TournamentRegisterRequest,
  TournamentRegisterResponse,
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
  TournamentDto,
  TournamentDeleteResponse,
  TournamentLogDto,
  GetSitInTournamentResponse as GetTournamentNonDealersResponse,
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

  @Get('/non-dealers') // 네이밍..
  async getNonDealers(): Promise<GetTournamentNonDealersResponse[]> {
    try {
      const tournaments =
        await this.tournamentService.getNonDealerTournaments();
      return tournaments.map<GetTournamentNonDealersResponse>((tournament) => {
        return {
          id: tournament.id,
          title: tournament.title,
        };
      });
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

  @Get('/:year/:month/:day')
  async tournamentsByDate(
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
  ): Promise<TournamentLogDto[]> {
    this.logger.log(`tournamentsByDate, ${year}/${month}/${day}`);

    try {
      const hours = 6; // 새벽에 시작하는 경우도 있으니 오전 6시를 기준으로 잡자
      const start = new Date(year, month - 1, day, hours, 0, 0, 0);

      const end = new Date(start.valueOf());
      end.setDate(start.getDate() + 1); // 하루만 조회

      return await this.tournamentService.tournamentByDate(start, end);
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
      return await this.tournamentService.registerTournament(
        dto.title,
        dto.blindStructureId,
        dto.lateRegBlindId,
        dto.buyIn,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Delete('/:id')
  async deleteTournament(
    @Param('id') id: number,
  ): Promise<TournamentDeleteResponse> {
    try {
      return await this.tournamentService.deleteTournament(id);
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

  @Put('/:id')
  async closeTournament(
    @Param('id') id: number,
  ): Promise<TournamentCloseResponse> {
    try {
      return await this.tournamentService.closeTournament(id);
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

  @Put('/:id/play')
  async play(@Param('id') id: number): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.play(id);
      if (clock === null) {
        return null;
      }
      return clock;
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

  @Put('/:id/blinds')
  async updateTournmentBlind(
    @Param('id') tournamentId: number,
    @Body() dto: TournamentBlindDto[],
  ): Promise<TournamentBlindDto[]> {
    try {
      return await this.tournamentService.updateBlind(tournamentId, dto);
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

  @Put('/:id/blind/up')
  async blindUp(
    @Param('id') id: number,
  ): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.upBlindLevel(id);
      if (clock === null) {
        return null;
      }
      return clock;
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

  @Put('/:id/blind/reset')
  async blindTimeReset(
    @Param('id') id: number,
  ): Promise<TournamentClockEventDto | null> {
    try {
      const clock = await this.tournamentService.resetBlindsTime(id);
      if (clock === null) {
        return null;
      }
      return clock;
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
