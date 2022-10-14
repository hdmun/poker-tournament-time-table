import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { DealerPlayLogDto } from './dto/dealer';
import { DealerPlayLog } from './entities/dealer-play-log.entity';

@CustomRepository(DealerPlayLog)
export class DealerPlayLogRepository extends Repository<DealerPlayLog> {
  async getLogByDate(start: Date, end: Date): Promise<DealerPlayLogDto[]> {
    return await this.createQueryBuilder('dealer_play_log')
      .innerJoin('tournament', 't', 't.id = dealer_play_log.tournament_id')
      .innerJoin('dealer', 'd', 'd.id = dealer_play_log.dealer_id')
      .where('dealer_play_log.sit_in_time >= :start', { start })
      .andWhere('dealer_play_log.sit_in_time <= :end', { end })
      .select([
        'dealer_play_log.sit_in_time AS sitInTime',
        'dealer_play_log.sit_out_time AS sitOutTime',
        'dealer_play_log.dealer_id AS dealerId',
        'dealer_play_log.play_seconds AS playSeconds',
        't.title AS tournamentTitle',
        'd.name AS dealerName',
      ])
      .getRawMany<DealerPlayLogDto>();
  }
}
