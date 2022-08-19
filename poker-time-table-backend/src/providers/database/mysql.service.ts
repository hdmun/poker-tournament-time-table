import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get<string>('DB_HOST'),
      port: this.config.get<number>('DB_PORT'),
      username: this.config.get<string>('DB_USER'),
      password: this.config.get<string>('DB_PASSWORD'),
      database: this.config.get<string>('DB_DATABASE'),
      entities: ['dist/**/**/*.entity{.ts,.js}'],
    };
  }
}
