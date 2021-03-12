import { Theater } from './theater.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class TheatersService extends TypeOrmCrudService<Theater> {
  constructor(@InjectRepository(Theater) repo) {
    super(repo);
  }
}
