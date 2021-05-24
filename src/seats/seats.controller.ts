import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatsService } from './seats.service';
import { Seat } from './seat.entity';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';

@Controller('seats')
export class SeatsController extends BaseControllerCRUD<Seat> {
  constructor(service: SeatsService) {
    super(service);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_SEAT)
  @UsePipes(ValidationPipe)
  createOne(@Body() createSeatDto: CreateSeatDto): Promise<Seat> {
    return this.service.createOne(createSeatDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_SEAT)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSeatDto,
  ): Promise<Seat> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_SEAT)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
  
}
