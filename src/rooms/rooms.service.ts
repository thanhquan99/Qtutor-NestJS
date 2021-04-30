import { Seat } from './../seats/seat.entity';
import { CreateSeatDto } from './../seats/dto/create-seat.dto';
import { Room } from './room.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';

@Injectable()
export class RoomsService extends BaseServiceCRUD<Room> {
  constructor(@InjectRepository(Room) repo) {
    super(repo, Room, 'room');
  }

  async getOwnSeats(id) {
    const room = await Room.findOne({
      where: { id },
      relations: ['seats'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async createOwnSeats(id: number, createSeatDto: CreateSeatDto) {
    const room = await Room.findOne({
      where: { id },
      relations: ['seats'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const { column, columns, row, type } = createSeatDto;
    if ((!column && !columns) || (column && columns)) {
      throw new BadRequestException('Should have column or columns');
    }

    if (column) {
      const seat = Seat.create({ column, row, type });
      room.seats.push(seat);
      await room.save().catch((err) => {
        throw new InternalServerErrorException(`Insert failed due to ${err}`);
      });
    }

    if (columns) {
      await getManager().transaction(async (entityManager) => {
        const seats = [];
        for (let i = 1; i <= columns; i++) {
          const seat = Seat.create({ column: i, row, type: 'Normal' });
          seats.push(seat);
        }
        room.seats.push(...seats);
        await entityManager.save(room).catch((err) => {
          throw new InternalServerErrorException(`Insert failed due to ${err}`);
        });
      });
    }

    return room;
  }
}
