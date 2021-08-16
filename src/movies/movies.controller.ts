import { MovieQueryParams } from './dto/index';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Showtime } from './../showtimes/showtimes.entity';
import { QueryShowtimes } from './../rooms/dto/query-showtimes.dto';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { UpdateMovieDto } from './dto/updateMovieDto';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'config/storage.config';
import { Express } from 'express';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';

@Controller('movies')
export class MoviesController extends BaseControllerCRUD<Movie> {
  constructor(public service: MoviesService) {
    super(service);
  }

  @Get()
  getMany(
    @Query(ValidationPipe) query: MovieQueryParams,
  ): Promise<{ results: Movie[]; total: number }> {
    try {
      if (query?.filter) {
        query.filter = JSON.parse(query.filter);
      }
      if (query?.orderBy) {
        query.orderBy = JSON.parse(query.orderBy);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return this.service.getMany(query);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_MOVIE)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'thumbnailImage', maxCount: 1 },
      ],
      { storage },
    ),
  )
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.createMovie(createMovieDto, files);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_MOVIE)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'thumbnailImage', maxCount: 1 },
      ],
      { storage },
    ),
  )
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.updateMovie(id, updateMovieDto, files);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_MOVIE)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Get('/:id/showtimes')
  getOwnShowtimes(
    @Param('id', ParseIntPipe) id: number,
    @Query(ValidationPipe) query: QueryShowtimes,
  ): Promise<{ movie: Movie; showtimes: Showtime[] }> {
    return this.service.getOwnShowtimes(id, query);
  }

  @Get('/:id/ratings')
  getRatingsByMovie(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRatingsByMovie(id);
  }
}
