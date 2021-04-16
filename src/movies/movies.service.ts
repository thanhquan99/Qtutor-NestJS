import { Director } from './../directors/director.entity';
import { Genre } from './../genres/genre.entity';
import { Actor } from './../actors/actor.entity';
import { UpdateMovieDto } from './dto/updateMovieDto';
import { Movie } from './movie.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/createMovieDto';
import { getManager } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class MoviesService extends TypeOrmCrudService<Movie> {
  constructor(@InjectRepository(Movie) repo) {
    super(repo);
  }

  makeImageUrl(fileName: string): string {
    return `${process.env.DOMAIN}/img/${fileName}`;
  }

  async createMovie(
    createMovieDto: CreateMovieDto,
    files: Express.Multer.File,
  ): Promise<Movie> {
    const image = {};

    if (files?.['mainImage']?.[0]) {
      const mainUrl = this.makeImageUrl(files['mainImage'][0].filename);
      image['mainUrl'] = mainUrl;
    }
    if (files?.['thumbnailImage']?.[0]) {
      const thumbnailUrl = this.makeImageUrl(
        files['thumbnailImage'][0].filename,
      );
      image['thumbnailUrl'] = thumbnailUrl;
    }

    const { actorIds, genreIds, directorIds } = createMovieDto;
    delete createMovieDto.actorIds;
    delete createMovieDto.genreIds;
    delete createMovieDto.directorIds;

    let movie;
    try {
      movie = await getManager().transaction(async (entityManager) => {
        const movie = entityManager.create(Movie, { ...createMovieDto, image });
        if (actorIds) {
          movie.actors = [];
          for (const actorId of actorIds) {
            const actor = await entityManager.findOne(Actor, actorId);
            if (!actor) {
              throw new NotFoundException('Actor not found');
            }
            movie.actors.push(actor);
          }
        }

        if (genreIds) {
          movie.genres = [];
          for (const genreId of genreIds) {
            const genre = await entityManager.findOne(Genre, genreId);
            if (!genre) {
              throw new NotFoundException('Genre not found');
            }
            movie.genres.push(genre);
          }
        }

        if (directorIds) {
          movie.directors = [];
          for (const directorId of directorIds) {
            const director = await entityManager.findOne(Director, directorId);
            if (!director) {
              throw new NotFoundException('Director not found');
            }
            movie.directors.push(director);
          }
        }

        return await entityManager.save(movie);
      });
    } catch (err) {
      throw new BadRequestException(`Failed due to ${err}`);
    }

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

    const image: { mainUrl: string; thumbnailUrl: string } = {
      mainUrl: undefined,
      thumbnailUrl: undefined,
    };

    (() => {
      if (files?.['mainImage']?.[0]) {
        const mainUrl = this.makeImageUrl(files['mainImage'][0].filename);
        image.mainUrl = mainUrl;
        return;
      }
      if (movie.image?.mainUrl) {
        image.mainUrl = movie.image.mainUrl;
      }
      return;
    })();

    (() => {
      if (files?.['thumbnailImage']?.[0]) {
        const thumbnailUrl = this.makeImageUrl(
          files['thumbnailImage'][0].filename,
        );
        image.thumbnailUrl = thumbnailUrl;
        return;
      }
      if (movie.image?.thumbnailUrl) {
        image.thumbnailUrl = movie.image.thumbnailUrl;
      }
      return;
    })();

    const { actorIds, genreIds, directorIds } = updateMovieDto;
    delete updateMovieDto.actorIds;
    delete updateMovieDto.genreIds;
    delete updateMovieDto.directorIds;

    try {
      await getManager().transaction(async (entityManager) => {
        movie.image = image;
        if (actorIds) {
          movie.actors = [];
          for (const actorId of actorIds) {
            const actor = await entityManager.findOne(Actor, actorId);
            if (!actor) {
              throw new NotFoundException('Actor not found');
            }
            movie.actors.push(actor);
          }
        }

        if (genreIds) {
          movie.genres = [];
          for (const genreId of genreIds) {
            const genre = await entityManager.findOne(Genre, genreId);
            if (!genre) {
              throw new NotFoundException('Genre not found');
            }
            movie.genres.push(genre);
          }
        }

        if (directorIds) {
          movie.directors = [];
          for (const directorId of directorIds) {
            const director = await entityManager.findOne(Director, directorId);
            if (!director) {
              throw new NotFoundException('Director not found');
            }
            movie.directors.push(director);
          }
        }
        await entityManager.save(movie);
        await entityManager.update(Movie, id, {
          ...updateMovieDto,
          image,
        });
      });
    } catch (err) {
      throw new BadRequestException(`Failed due to ${err}`);
    }
    return this.repo.findOne(id);
  }
}
