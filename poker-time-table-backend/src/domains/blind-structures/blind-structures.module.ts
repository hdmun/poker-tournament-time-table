import { Module } from '@nestjs/common';
import { BlindStructureService } from './blind-structures.service';
import { BlindStructureController } from './blind-structures.controller';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { BlindStructureMetaRepository } from './blind-structures-meta.repository';
import { BlindStructureRepository } from './blind-structures.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BlindStructureMetaRepository,
      BlindStructureRepository,
    ]),
  ],
  providers: [BlindStructureService],
  controllers: [BlindStructureController],
})
export class BlindStructureModule {}
