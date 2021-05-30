import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { TicketType } from './ticket-type.entity';
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { TicketTypesService } from './ticket-types.service';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('ticket-types')
export class TicketTypesController extends BaseControllerCRUD<TicketType> {
  constructor(service: TicketTypesService) {
    super(service);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions('')
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateTicketTypeDto): Promise<TicketType> {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_SHOWTIME)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTicketTypeDto,
  ): Promise<TicketType> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_SHOWTIME)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
}
