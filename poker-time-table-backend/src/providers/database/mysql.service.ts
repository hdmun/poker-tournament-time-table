import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
<<<<<<< HEAD
=======
import { BlindStructureMeta } from '~/blind-structures/entities/blind-structure-meta.entity';
import { BlindStructure } from '~/blind-structures/entities/blind-structure.entity';
import { TournamentBlind } from '~/tournaments/entities/tournament-blind.entity';
import { Tournament } from '~/tournaments/entities/tournament.entity';
>>>>>>> backend

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
<<<<<<< HEAD
      entities: ['dist/**/**/*.entity{.ts,.js}'],
=======
      synchronize: process.env.NODE_ENV === 'dev',
      entities: [
        BlindStructureMeta,
        BlindStructure,
        Tournament,
        TournamentBlind,
      ],
      logging: process.env.NODE_ENV === 'dev' ? ['query', 'error'] : undefined,
>>>>>>> backend
    };
  }
}