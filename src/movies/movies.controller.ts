import { Actor } from './../actors/actor.entity';
import { UpdateMovieDto } from './dto/updateMovieDto';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Country, Movie } from './movie.entity';
import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from 'config/storage.config';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { MoviesModule } from './movies.module';

@Crud({
  model: {
    type: Movie,
  },
})
@Controller('movies')
export class MoviesController implements CrudController<Movie> {
  constructor(public service: MoviesService) {}
  get base(): CrudController<Movie> {
    return this;
  }

  @Override('createOneBase')
  @UseGuards(AuthGuard())
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
    @ParsedBody() createMovieDto: CreateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.createMovie(createMovieDto, files);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
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
    @ParsedBody() updateMovieDto: UpdateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.updateMovie(id, updateMovieDto, files);
  }
}
