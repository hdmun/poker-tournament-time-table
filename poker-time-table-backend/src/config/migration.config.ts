import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

let path = '.env';
if (process.env.NODE_ENV === 'dev') {
  path = '.env.dev';
}

dotenv.config({ path });

const configService = new ConfigService();
export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [
    process.env.NODE_ENV === 'dev'
      ? 'src/**/**.entity.ts'
      : 'dist/**/**.entity{.ts,.js}',
  ],
  migrationsTableName: 'migrations',
  migrations: [
    process.env.NODE_ENV === 'dev'
      ? 'src/database/migrations/*.ts'
      : 'dist/database/migrations/*{.ts,.js}',
  ],
  synchronize: false,
  logging: false,
});
