import { TicketType } from './ticket-type.entity';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TicketTypesController } from './ticket-types.controller';
import { TicketTypesService } from './ticket-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketType]), AuthModule],
  controllers: [TicketTypesController],
  providers: [TicketTypesService],
})
export class TicketTypesModule {}
