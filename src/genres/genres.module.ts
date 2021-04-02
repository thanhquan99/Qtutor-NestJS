import { AuthModule } from './../auth/auth.module';
import { Genre } from './genre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), AuthModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
