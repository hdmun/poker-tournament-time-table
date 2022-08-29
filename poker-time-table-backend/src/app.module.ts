import { Module } from '@nestjs/common';
import { MySqlTypeOrmModule } from './providers/database/mysql.module';
import { AppConfigMoudle } from './config/app.config';
import { TournamentModule } from './tournaments/tournament.module';

@Module({
  imports: [AppConfigMoudle, MySqlTypeOrmModule, TournamentModule],
})
export class AppModule {}
