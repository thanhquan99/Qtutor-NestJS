import { QueryShowtimes } from './../rooms/dto/query-showtimes.dto';
import { CreateRoomDto } from './../rooms/dto/create-room.dto';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { PermissionAction } from 'src/permissions/permission.entity';
import { UpdateCinemaDto } from './dto/update-cinema-dto';
import { CinemaService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Cinema } from './cinema.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cinemas')
export class CinemasController extends BaseControllerCRUD<Cinema> {
  constructor(service: CinemaService) {
    super(service);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_CINEMA)
  @UsePipes(ValidationPipe)
  createOne(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.service.createOne(createCinemaDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_CINEMA)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_CINEMA)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return this.service.updateOne(id, updateCinemaDto);
  }

  @Get('/:id/rooms')
  getOwnRooms(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOwnRooms(id);
  }

  @Post('/:id/rooms')
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_THEATER)
  @UsePipes(ValidationPipe)
  createOwnRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Cinema> {
    return this.service.createOwnRoom(id, createRoomDto);
  }

  @Get('/:id/showtimes')
  getOwnShowtimes(
    @Param('id', ParseIntPipe) id: number,
    @Query(ValidationPipe) query: QueryShowtimes,
  ) {
    return this.service.getOwnShowtimes(id, query);
  }
}
