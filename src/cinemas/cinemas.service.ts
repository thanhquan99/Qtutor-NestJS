import { Movie } from './../movies/movie.entity';
import { Ticket } from './../tickets/ticket.entity';
import { Seat } from './../seats/seat.entity';
import { QueryShowtimes } from './../rooms/dto/query-showtimes.dto';
import { Room } from './../rooms/room.entity';
import { CreateRoomDto } from './../rooms/dto/create-room.dto';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Cinema } from './cinema.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';

@Injectable()
export class CinemaService extends BaseServiceCRUD<Cinema> {
  constructor(@InjectRepository(Cinema) repo) {
    super(repo, Cinema, 'cinema');
  }

  async getOwnRooms(id: number) {
    const cinema = await Cinema.createQueryBuilder('cinema')
      .where('cinema.id = :id', { id })
      .leftJoinAndSelect('cinema.rooms', 'room')
      .getOne();
    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }
    return cinema;
  }

  async createOwnRoom(
    id: number,
    createTheaterDto: CreateRoomDto,
  ): Promise<Cinema> {
    const { roomNumber } = createTheaterDto;
    const cinema = await Cinema.findOne({
      where: { id },
      relations: ['rooms'],
    });

    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }
    const manager = getManager();

    const checkRoom = await manager
      .createQueryBuilder(Room, 'room')
      .where('"cinemaId" = :id and "roomNumber" = :roomNumber', {
        id,
        roomNumber,
      })
      .getOne();
    if (checkRoom) {
      throw new BadRequestException(
        `Room Number ${roomNumber} is already exist in this cinema`,
      );
    }

    const room = Room.create(createTheaterDto);
    cinema.rooms.push(room);
    return cinema.save();
  }

  async getOwnShowtimes(id: number, query: QueryShowtimes) {
    const cinema = await Cinema.findOne(id);
    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }

    const rooms = await Room.find({ where: { cinema }, select: ['id'] });

    const seats: Seat[] = [];
    for (const room of rooms) {
      const seat = await Seat.findOne({
        where: { room },
        relations: ['tickets'],
        select: ['id'],
      });
      if (seat) {
        seats.push(seat);
      }
    }

    const tickets: Ticket[] = [];
    for (const seat of seats) {
      const results = await Ticket.find({
        where: { seat },
        relations: ['showtime'],
        select: ['id'],
      });
      if (results?.length) {
        tickets.push(...results);
      }
    }

    const showtimeIds = tickets.map((ticket) => ticket.showtime.id);
    const movieBuilder = Movie.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.showtimes', 'showtime')
      .where('showtime.id = ANY(:showtimeIds)', { showtimeIds })
      .orderBy('showtime.startTime');
    if (query.date) {
      const startTime = new Date(`${query.date} 0:0 UTC`);
      const endTime = new Date(`${query.date} 23:59 UTC`);
      movieBuilder.andWhere(
        'showtime.startTime BETWEEN :startTime and :endTime',
        {
          startTime,
          endTime,
        },
      );
    }
    const movies = await movieBuilder.getMany();

    return { cinema, movies };
  }
}
