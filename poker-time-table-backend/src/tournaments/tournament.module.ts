import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmExModule } from '~/typeorm-ex/typeorm-ex.module';
import { BlindStructureMetaRepository } from './blind-structure-meta.repository';
import { BlindStructureRepository } from './blind-structure.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BlindStructureMetaRepository]),
    TypeOrmExModule.forCustomRepository([BlindStructureRepository]),
  ],
  providers: [TournamentService],
  controllers: [TournamentController],
})
export class TournamentModule {}
