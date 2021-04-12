import { UpdateMovieDto } from './dto/updateMovieDto';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import {
  Controller,
  Param,
  ParseIntPipe,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Crud, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'config/storage.config';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';

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
    @ParsedBody() createMovieDto: CreateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.createMovie(createMovieDto, files);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
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
    @ParsedBody() updateMovieDto: UpdateMovieDto,
    @UploadedFiles() files: Express.Multer.File,
  ): Promise<Movie> {
    return this.service.updateMovie(id, updateMovieDto, files);
  }
}
