import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Post()
  @ApiBearerAuth()
  @Permissions('')
  @UsePipes(ValidationPipe)
  bookTickets(@Body() createDto: CreateTicketDto, @GetUser() user: User) {
    return this.service.bookTickets(createDto.tickets, createDto.status, user);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions('')
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.service.updateOne(id, updateDto);
  }
}
