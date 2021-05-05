import { CinemaService } from './cinemas.service';
import { AuthModule } from './../auth/auth.module';
import { Cinema } from './cinema.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CinemasController } from './cinemas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema]), AuthModule],
  controllers: [CinemasController],
  providers: [CinemaService],
})
export class CinemasModule {}
