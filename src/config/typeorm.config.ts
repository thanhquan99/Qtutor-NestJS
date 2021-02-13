import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const DATABASE_URL: string =
  process.env.DATABASE_URL ||
  'postgres://postgres:123456789@localhost:5432/cinema_api';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:
    'postgres://pvqypmmedqizey:60fee49ee1390f35da40d785c86eaf71d2788cd6abb39dcf9d2e199c90273399@ec2-54-211-77-238.compute-1.amazonaws.com:5432/d6rfrr68dd1c5c',
  entities: [__dirname + '/../**/*.entity.js'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: true,
};
