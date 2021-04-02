import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Genre } from './genre.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenresService extends TypeOrmCrudService<Genre> {
  constructor(@InjectRepository(Genre) repo) {
    super(repo);
  }
  async createGenre(dto: Genre) {
    const genre: Genre = await this.repo.findOne(dto);
    if (genre) {
      throw new BadRequestException('Genre is already exist');
    }
    const data = Genre.create(dto);
    return await data.save();
  }
}
