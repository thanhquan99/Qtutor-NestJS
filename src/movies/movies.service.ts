import { Movie } from './movie.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesService extends TypeOrmCrudService<Movie> {
  constructor(@InjectRepository(Movie) repo) {
    super(repo);
  }
}
