import { AppModule } from './../app.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as CONFIG from 'config';

const dbConfig = CONFIG.get('db');
const DATABASE_URL: string = process.env.DATABASE_URL || dbConfig.url;
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.js'],
  ssl: dbConfig.ssl,
  synchronize: dbConfig.synchronize,
};

console.log('Config Database: ', typeOrmConfig);
