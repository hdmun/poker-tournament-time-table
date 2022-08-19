import { Module } from '@nestjs/common';
import { MySqlTypeOrmModule } from './providers/database/mysql.module';
import { AppConfigMoudle } from './config/app.config';

@Module({
  imports: [AppConfigMoudle, MySqlTypeOrmModule],
})
export class AppModule {}
