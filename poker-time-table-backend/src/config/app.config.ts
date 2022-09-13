import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const AppConfigMoudle = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
  // ignoreEnvFile: process.env.NODE_ENV === 'prod', // prod할 때는 heroku에 따로 넣기로
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
  }),
});
