import { Injectable, Logger } from '@nestjs/common';
import { InvalidInputError } from '~/common/exceptions';
import { DealerRepository } from './dealer.repository';
import { DealerDto } from './dto/dealer';
import { Dealer } from './entities/dealer.entity';
import { mapFromDelaerToDto } from './mapper/dealer';

@Injectable()
export class DealerService {
  private logger: Logger = new Logger(DealerService.name);

  constructor(private readonly dealerRepository: DealerRepository) {}

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
}
