import { Room } from './room.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomsService extends BaseServiceCRUD<Room> {
  constructor(@InjectRepository(Room) repo) {
    super(repo, Room, 'room');
  }
}
