import { PermissionAction } from 'src/permissions/permission.entity';
import { Theater } from './../theaters/theater.entity';
import { CreateTheaterDto } from './../theaters/dto/create-theater.dto';
import { UpdateCinemaDto } from './dto/update-cinema-dto';
import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';
import { CinemasService } from './cinemas.service';
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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('cinemas')
export class CinemasController {
  constructor(private cinemaService: CinemasService) {}

  @Get('/:id')
  getCinema(@Param('id', ParseIntPipe) id: number): Promise<Cinema> {
    return this.cinemaService.getCinemaById(id);
  }

  @Get()
  getCinemas(
    @Query(ValidationPipe) filterDto: CinemasFilterDto,
  ): Promise<Cinema[]> {
    return this.cinemaService.getCinemas(filterDto);
  }

  @Post()
  @Permissions(PermissionAction.CREATE_CINEMA)
  @UsePipes(ValidationPipe)
  createCinema(
    @Body() createCinemaDto: CreateCinemaDto,
    @GetUser() user: User,
  ): Promise<Cinema> {
    console.log(user);
    return this.cinemaService.createCinema(createCinemaDto);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_CINEMA)
  deleteCinemaById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cinemaService.deleteCinemaById(id);
  }

  @Patch('/:id')
  @Permissions(PermissionAction.UPDATE_CINEMA)
  @UsePipes(ValidationPipe)
  updateCinema(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return this.cinemaService.updateCinema(id, updateCinemaDto);
  }

  @Get('/:id/theaters')
  getOwnTheaters(@Param('id', ParseIntPipe) id: number) {
    return this.cinemaService.getOwnTheaters(id);
  }

  @Post('/:id/theaters')
  @Permissions(PermissionAction.CREATE_THEATER)
  @UsePipes(ValidationPipe)
  createOwnTheater(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTheaterDto: CreateTheaterDto,
  ): Promise<Cinema> {
    return this.cinemaService.createOwnTheater(id, createTheaterDto);
  }
}
