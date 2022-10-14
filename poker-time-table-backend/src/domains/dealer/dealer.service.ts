import { Injectable, Logger } from '@nestjs/common';
import { InvalidInputError } from '~/common/exceptions';
import { TournamentRepository } from '../tournaments/tournament.repository';
import { DealerPlayLogRepository } from './dealer-play-log.repository';
import { DealerRepository } from './dealer.repository';
import {
  DealerDto,
  DealerPlayLogDto,
  UpdateDealerResultDto,
} from './dto/dealer';
import { DealerPlayLog } from './entities/dealer-play-log.entity';
import { Dealer } from './entities/dealer.entity';
import { mapFromDelaerToDto } from './mapper/dealer';

@Injectable()
export class DealerService {
  private logger: Logger = new Logger(DealerService.name);

  constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly dealerPlayLogRepository: DealerPlayLogRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async all(): Promise<DealerDto[]> {
    const dealers = await this.dealerRepository.find({
      relations: ['tournament'],
    });

    return dealers.map<DealerDto>((dealer) => {
      return mapFromDelaerToDto(dealer);
    });
  }

  async register(name: string): Promise<DealerDto> {
    this.logger.log(`register, name: ${name}`);

    const dealer = await this.dealerRepository.findOneBy({ name });
    if (dealer) {
      throw new InvalidInputError(`이미 존재하는 딜러 이름 입니다. ${name}`);
    }

    const newDealer = Dealer.Create(name, 0, null);
    await this.dealerRepository.insert(newDealer);
    return mapFromDelaerToDto(newDealer);
  }

  async update(
    dealerId: number,
    tournamentId: number,
  ): Promise<UpdateDealerResultDto> {
    this.logger.log(
      `update, dealerId: ${dealerId}, tournamentId: ${tournamentId}`,
    );

    // 최적화는 구현하고 나서 하자
    const dealer = await this.dealerRepository.findOneBy({ id: dealerId });
    if (!dealer) {
      throw new InvalidInputError(
        `존재하지 않는 딜러입니다. dealerId: ${dealerId}`,
      );
    }

    const now = new Date();
    if (tournamentId <= 0) {
      const playLog = DealerPlayLog.Create(
        dealer.sitInTime,
        now,
        dealerId,
        dealer.tournamentId,
      );
      this.dealerPlayLogRepository.insert(playLog);
    }

    dealer.tournamentId = tournamentId;
    dealer.sitInTime = tournamentId > 0 ? now : null;
    await this.dealerRepository.save(dealer);

    const tournamentTitle = await this.tournamentRepository.getTitleById(
      tournamentId,
    );

    return {
      dealerId,
      dealerName: dealer.name,
      tournamentId,
      tournamentTitle: tournamentTitle ?? '',
      sitInTime: dealer.sitInTime,
    };
  }

  async getLogByDate(start: Date, end: Date): Promise<DealerPlayLogDto[]> {
    this.logger.log(`getLogByDate, start: ${start}, end: ${end}`);

    return this.dealerPlayLogRepository.getLogByDate(start, end);
  }
}
