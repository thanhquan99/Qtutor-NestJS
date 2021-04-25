import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Director } from './../directors/director.entity';
import { Genre } from './../genres/genre.entity';
import { Actor } from './../actors/actor.entity';
import { UpdateMovieDto } from './dto/updateMovieDto';
import { Movie } from './movie.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/createMovieDto';
import { getManager } from 'typeorm';

@Injectable()
export class MoviesService extends BaseServiceCRUD<Movie> {
  constructor(@InjectRepository(Movie) repo) {
    super(repo, Movie, 'movie');
  }

  makeImageUrl(fileName: string): string {
    return `${process.env.DOMAIN}/img/${fileName}`;
  }

  async getMany(query) {
    const builder = getManager()
      .createQueryBuilder(Movie, 'movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.actors', 'actor')
      .leftJoinAndSelect('movie.directors', 'director');

    return await this.queryBuilder(builder, query, 'movie').catch((err) => {
      throw new BadRequestException(`Query failed due to ${err}`);
    });
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
          const actors = await entityManager
            .createQueryBuilder(Actor, 'actor')
            .where('id = ANY(:actorIds)', { actorIds })
            .getMany();
          movie.actors = actors;
        }

        if (genreIds) {
          const genres = await entityManager
            .createQueryBuilder(Genre, 'genre')
            .where('id = ANY(:genreIds)', { genreIds })
            .getMany();
          movie.genres = genres;
        }

        if (directorIds) {
          const directors = await entityManager
            .createQueryBuilder(Director, 'director')
            .where('id = ANY(:directorIds)', { directorIds })
            .getMany();
          movie.directors = directors;
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
    const movie = await Movie.findOne({ where: { id } });
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

    await getManager()
      .transaction(async (entityManager) => {
        movie.image = image;
        if (actorIds) {
          const actors = await entityManager
            .createQueryBuilder(Actor, 'actor')
            .where('id = ANY(:actorIds)', { actorIds })
            .getMany();
          movie.actors = actors;
        }

        if (genreIds) {
          const genres = await entityManager
            .createQueryBuilder(Genre, 'genre')
            .where('id = ANY(:genreIds)', { genreIds })
            .getMany();
          movie.genres = genres;
        }

        if (directorIds) {
          const directors = await entityManager
            .createQueryBuilder(Director, 'director')
            .where('id = ANY(:directorIds)', { directorIds })
            .getMany();
          movie.directors = directors;
        }

        await entityManager.save(movie);
        await entityManager.update(Movie, id, {
          ...updateMovieDto,
          image,
        });
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Update movie failed due to ${err}`,
        );
      });
    return movie;
  }
}
