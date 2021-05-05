import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Director } from './director.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectorsService extends BaseServiceCRUD<Director> {
  constructor(@InjectRepository(Director) repo) {
    super(repo, Director, 'director');
  }
}
