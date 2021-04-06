import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as CONFIG from 'config';
import { ConnectionOptions } from 'typeorm';
import { join } from 'path';

const dbConfig = CONFIG.get('db');
const DATABASE_URL: string = process.env.DATABASE_URL || dbConfig.url;
export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.js'],
  ssl: dbConfig.ssl,
  synchronize: dbConfig.synchronize,
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

console.log('Config Database: ', typeOrmConfig);
