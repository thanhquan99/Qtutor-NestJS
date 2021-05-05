import { AuthModule } from './../auth/auth.module';
import { Ticket } from './ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), AuthModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
