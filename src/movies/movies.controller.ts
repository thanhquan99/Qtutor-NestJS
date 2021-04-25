import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { UpdateMovieDto } from './dto/updateMovieDto';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Post()
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
  @Permissions(PermissionAction.DELETE_MOVIE)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
}
