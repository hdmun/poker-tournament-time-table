import { Controller, Logger } from '@nestjs/common';
import { DealerService } from './dealer.service';

@Controller('dealers')
export class DealerController {
  private _logger: Logger = new Logger(DealerController.name);

  constructor(private readonly _dealerService: DealerService) {}
}
