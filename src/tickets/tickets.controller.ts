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

@Controller('tickets')
export class TicketsController extends BaseControllerCRUD<Ticket> {
  constructor(service: TicketsService) {
    super(service);
  }

  @Post()
  createOne(@Body() createDto: CreateTicketDto): Promise<Ticket> {
    throw new NotFoundException('Not found');
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
