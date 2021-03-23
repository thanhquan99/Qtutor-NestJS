import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Actor } from './actor.entity';

@Injectable()
export class ActorsService extends TypeOrmCrudService<Actor> {
  constructor(@InjectRepository(Actor) repo) {
    super(repo);
  }
}
