import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateTheaterDto } from './../theaters/dto/create-theater.dto';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('cinemas')
export class CinemasController extends BaseControllerCRUD<Cinema> {
  constructor(service: CinemaService) {
    super(service);
  }

  @Post()
  @Permissions(PermissionAction.CREATE_CINEMA)
  @UsePipes(ValidationPipe)
  createOne(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.service.createOne(createCinemaDto);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_CINEMA)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Patch('/:id')
  @Permissions(PermissionAction.UPDATE_CINEMA)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return this.service.updateOne(id, updateCinemaDto);
  }

  @Get('/:id/theaters')
  getOwnTheaters(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOwnTheaters(id);
  }

  @Post('/:id/theaters')
  @Permissions(PermissionAction.CREATE_THEATER)
  @UsePipes(ValidationPipe)
  createOwnTheater(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTheaterDto: CreateTheaterDto,
  ): Promise<Cinema> {
    return this.service.createOwnTheater(id, createTheaterDto);
  }
}
