import { Seat } from './seat.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), AuthModule],
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}
