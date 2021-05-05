import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './showtimes.entity';
import { ShowtimesService } from './showtimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), AuthModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
