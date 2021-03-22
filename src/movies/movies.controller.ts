import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
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
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() createMovieDto: CreateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    const image = {};

    if (files?.['mainImage']?.[0]) {
      const mainUrl = `${process.env.DOMAIN}/${files['mainImage'][0].filename}`;
      image['mainUrl'] = mainUrl;
    }
    if (files?.['thumbnailImage']?.[0]) {
      const thumbnailUrl = `${process.env.DOMAIN}/${files['thumbnailImage'][0].filename}`;
      image['thumbnailUrl'] = thumbnailUrl;
    }

    const movie = Movie.create({ ...createMovieDto, ...{ image: image } });
    await movie.save();

    return movie;
  }
}
