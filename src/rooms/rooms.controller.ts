import { CreateSeatDto } from './../seats/dto/create-seat.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('rooms')
export class RoomsController extends BaseControllerCRUD<Room> {
  constructor(service: RoomsService) {
    super(service);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.CREATE_THEATER)
  createOne(@Body() createDto: CreateRoomDto): Promise<Room> {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.UPDATE_THEATER)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_THEATER)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Get('/:id/seats')
  getOwnSeats(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return this.service.getOwnSeats(id);
  }

  @Post('/:id/seats')
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.CREATE_SEAT)
  createOwnSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body() createSeatDto: CreateSeatDto,
  ): Promise<Room> {
    return this.service.createOwnSeats(id, createSeatDto);
  }
}
