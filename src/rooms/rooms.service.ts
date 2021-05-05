import { QueryShowtimes } from './dto/query-showtimes.dto';
import { Showtime } from './../showtimes/showtimes.entity';
import { Ticket } from './../tickets/ticket.entity';
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
import { Any, getManager, Between } from 'typeorm';

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

  async getOwnShowtimes(id: number, query: QueryShowtimes) {
    const room = await Room.findOne({
      where: { id },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const seat = await Seat.findOne({
      where: { room },
    });
    const tickets = await Ticket.find({
      relations: ['showtime'],
      where: { seat },
      select: ['id'],
    });

    const showtimeIds = tickets.map((ticket) => ticket.showtime.id);
    const filters = { id: Any(showtimeIds) };
    if (query.date) {
      const startTime = new Date(`${query.date} 0:0 UTC`);
      const endTime = new Date(`${query.date} 23:59 UTC`);
      filters['startTime'] = Between(
        startTime.toISOString(),
        endTime.toISOString(),
      );
    }
    const showtimes = await Showtime.find({
      where: filters,
      relations: ['movie'],
      order: {
        startTime: 'ASC',
      },
    });

    return { room, showtimes };
  }
}
