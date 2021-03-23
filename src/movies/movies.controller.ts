import { UpdateMovieDto } from './dto/updateMovieDto';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
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
  @Post('/upload') // API path
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainUrl', maxCount: 1 },
        { name: 'thumbnailUrl', maxCount: 1 },
      ], // name of the field being passed
      { storage },
    ),
  )
  async upload(@UploadedFiles() files) {
    console.log(files);
    return files;
  }

  @Override()
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
  async createOne(
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
