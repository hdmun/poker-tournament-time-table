import { DealerDto } from '../dto/dealer';
import { Dealer } from '../entities/dealer.entity';

export function mapFromDelaerToDto(dealer: Dealer): DealerDto {
  return {
    id: dealer.id,
    name: dealer.name,
    tournament: dealer.tournament?.title,
    sitInTime: dealer.sitInTime?.toString(),
  };
}
