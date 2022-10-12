import { Injectable, Logger } from '@nestjs/common';
import { DealerRepository } from './dealer.repository';

@Injectable()
export class DealerService {
  private _logger: Logger = new Logger(DealerService.name);

  constructor(private readonly _dealerRepository: DealerRepository) {}
}
