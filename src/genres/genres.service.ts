import { CreateGenreDto } from './dto/create-genre.dto';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Genre } from './genre.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenresService extends BaseServiceCRUD<Genre> {
  constructor(@InjectRepository(Genre) repo) {
    super(repo, Genre, 'genre');
  }

  async createOne(createDto: CreateGenreDto) {
    const genre = await Genre.findOne(createDto);
    if (genre) {
      throw new BadRequestException('Genre is already exist');
    }
    const data = Genre.create(createDto);
    return await data.save();
  }
}
