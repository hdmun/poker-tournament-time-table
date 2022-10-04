import { Module } from '@nestjs/common';
import { MySqlTypeOrmModule } from './providers/database/mysql.module';
import { AppConfigMoudle } from './config/app.config';
import { TournamentModule } from './domains/tournaments/tournament.module';
import { BlindStructureModule } from './domains/blind-structures/blind-structures.module';

@Module({
  imports: [
    AppConfigMoudle,
    MySqlTypeOrmModule,
    TournamentModule,
    BlindStructureModule,
  ],
})
export class AppModule {}
