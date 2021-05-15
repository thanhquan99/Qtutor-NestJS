import { PermissionAction } from './../permissions/permission.entity';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {

  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateTicketDto, @GetUser() user : User){
    return this.service.bookTickets(createDto.tickets, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    throw new NotFoundException('Not found');
  }
}
