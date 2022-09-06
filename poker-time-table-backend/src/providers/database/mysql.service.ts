import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { BlindStructureMeta } from '~/tournaments/entities/blind-structure-meta.entity';
import { BlindStructure } from '~/tournaments/entities/blind-structure.entity';
import { Tournament } from '~/tournaments/entities/tournament.entity';

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
      synchronize: process.env.NODE_ENV === 'dev',
      entities: [BlindStructureMeta, BlindStructure, Tournament],
      logging: process.env.NODE_ENV === 'dev' ? ['query', 'error'] : undefined,
    };
  }
}
