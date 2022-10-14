import {
  DealerDto,
  DealerPlayLogDto,
  GetDealerLogResponse,
} from '../dto/dealer';
import { Dealer } from '../entities/dealer.entity';

export function mapFromDelaerToDto(dealer: Dealer): DealerDto {
  return {
    id: dealer.id,
    name: dealer.name,
    tournament: dealer.tournament?.title,
    sitInTime: dealer.sitInTime?.toString(),
  };
}

// from ~ to, to ~ from 뭐가 더 나을까?
export function mapToResponseFromPlayLogDto(
  dto: DealerPlayLogDto,
): GetDealerLogResponse {
  return {
    sitInTime: dto.sitInTime.toString(),
    sitOutTime: dto.sitOutTime.toString(),
    dealerId: dto.dealerId,
    playSeconds: dto.playSeconds,
    tournamentTitle: dto.tournamentTitle,
    dealerName: dto.dealerName,
  };
}
