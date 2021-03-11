import { AuthModule } from './../auth/auth.module';
import { CinemaRepository } from './cinema.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CinemasController } from './cinemas.controller';
import { CinemasService } from './cinemas.service';

@Module({
  imports: [TypeOrmModule.forFeature([CinemaRepository]), AuthModule],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}
