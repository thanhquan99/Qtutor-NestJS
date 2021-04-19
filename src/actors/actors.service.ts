import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Actor } from './actor.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';

@Injectable()
export class ActorsService extends BaseServiceCRUD<Actor> {
  constructor(@InjectRepository(Actor) repo) {
    super(repo, Actor, 'actor');
  }
}
