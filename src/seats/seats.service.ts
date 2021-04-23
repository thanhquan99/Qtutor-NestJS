import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Seat } from './seat.entity';

@Injectable()
export class SeatsService extends BaseServiceCRUD<Seat> {
  constructor(@InjectRepository(Seat) repo) {
    super(repo, Seat, 'seat');
  }
}
