import { Director } from './director.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectorsService extends TypeOrmCrudService<Director> {
  constructor(@InjectRepository(Director) repo) {
    super(repo);
  }
}
