import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CinemasModule } from './cinemas/cinemas.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TheatersModule } from './theaters/theaters.module';
import { MoviesModule } from './movies/movies.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ActorsModule } from './actors/actors.module';
import { DirectorsModule } from './directors/directors.module';
import { GenresModule } from './genres/genres.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    CinemasModule,
    UsersModule,
    AuthModule,
    TheatersModule,
    MoviesModule,
    ActorsModule,
    DirectorsModule,
    GenresModule,
    RolesModule,
  ],
})
export class AppModule {}
