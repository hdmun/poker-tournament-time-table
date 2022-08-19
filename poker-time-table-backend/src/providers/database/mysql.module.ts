import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfigService } from './mysql.service';

@Module({
  providers: [MySqlConfigService],
})
export class MySqlConfigModule {}

export const MySqlTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [MySqlConfigModule],
  useClass: MySqlConfigService,
  inject: [MySqlConfigService],
});
