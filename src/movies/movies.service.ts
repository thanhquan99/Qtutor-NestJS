import { UpdateMovieDto } from './dto/updateMovieDto';
import { Movie } from './movie.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/createMovieDto';

@Injectable()
export class MoviesService extends TypeOrmCrudService<Movie> {
  constructor(@InjectRepository(Movie) repo) {
    super(repo);
  }

  async createMovie(
    createMovieDto: CreateMovieDto,
    files: Express.Multer.File,
  ): Promise<Movie> {
    const image = {};

    if (files?.['mainImage']?.[0]) {
      const mainUrl = `${process.env.DOMAIN}/${files['mainImage'][0].filename}`;
      image['mainUrl'] = mainUrl;
    }
    if (files?.['thumbnailImage']?.[0]) {
      const thumbnailUrl = `${process.env.DOMAIN}/${files['thumbnailImage'][0].filename}`;
      image['thumbnailUrl'] = thumbnailUrl;
    }

    const movie = Movie.create({ ...createMovieDto, image });
    await movie.save();

    return movie;
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
    files: Express.Multer.File,
  ): Promise<Movie> {
    const movie = await this.repo.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Could not found this movie');
    }
    const image = {};

    if (files?.['mainImage']?.[0]) {
      const mainUrl = `${process.env.DOMAIN}/${files['mainImage'][0].filename}`;
      image['mainUrl'] = mainUrl;
    } else {
      image['mainUrl'] = movie.image.mainUrl;
    }

    if (files?.['thumbnailImage']?.[0]) {
      const thumbnailUrl = `${process.env.DOMAIN}/${files['thumbnailImage'][0].filename}`;
      image['thumbnailUrl'] = thumbnailUrl;
    } else {
      image['thumbnailUrl'] = movie.image.thumbnailUrl;
    }

    return await this.repo.save({ id, ...updateMovieDto, image });
  }
}
