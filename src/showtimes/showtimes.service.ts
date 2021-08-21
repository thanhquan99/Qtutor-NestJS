import { Cinema } from './../cinemas/cinema.entity';
import { ShowtimeQueryParams } from './dto/index';
import { Seat } from './../seats/seat.entity';
import {
  TicketType,
  TICKET_TYPE_NAME,
} from './../ticket-types/ticket-type.entity';
import { Ticket, TICKET_STATUS } from './../tickets/ticket.entity';
import { Room } from './../rooms/room.entity';
import { Movie } from './../movies/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Showtime } from './showtimes.entity';
import { Equal, getManager } from 'typeorm';

@Injectable()
export class ShowtimesService extends BaseServiceCRUD<Showtime> {
  constructor(@InjectRepository(Showtime) repo) {
    super(repo, Showtime, 'showtime');
  }

  async getMany(
    query: ShowtimeQueryParams,
  ): Promise<{ results: Showtime[]; total: number }> {
    const { relationsWith, filterByFields, perPage, page, orderBy } =
      await this.modifyQuery(query);

    let showtimeIds: number[] = [];
    if (query.cinemaId) {
      const cinema = await Cinema.findOne(query.cinemaId);
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

      showtimeIds = tickets.map((ticket) => ticket.showtime.id);
    }

    const [results, total] = await getManager()
      .findAndCount(Showtime, {
        relations: relationsWith,
        where: (qb) => {
          qb.where(filterByFields);
          if (query.cinemaId) {
            qb.andWhereInIds(showtimeIds);
          }
          if (query.movieId) {
            qb.andWhere({ movie: { id: query.movieId } });
          }
        },
        order: orderBy,
        take: perPage,
        skip: (page - 1) * perPage,
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(`Failed due to ${err}`);
      });

    await Promise.all(
      results.map(async (showtime) => {
        const ticket = await Ticket.findOne({
          relations: ['seat', 'seat.room', 'seat.room.cinema'],
          where: { showtime },
          select: ['id'],
        });
        showtime.room = ticket?.seat?.room;
      }),
    );

    return {
      results,
      total,
    };
  }

  async createOne(createDto: CreateShowtimeDto) {
    const {
      advertiseTime = 0,
      movieId,
      roomId,
      date,
      hour,
      minute,
    } = createDto;

    const movie = await Movie.findOne({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const room = await Room.findOne({
      where: { id: roomId },
      relations: ['seats'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const startTime = new Date(`${date} ${hour}:${minute} UTC`);
    const endTime = new Date(
      startTime.getTime() + 1000 * 60 * (advertiseTime + movie.duration),
    );

    const seat = await Seat.findOne({
      where: { room },
    });
    if (!seat) {
      throw new BadRequestException(`This room don't have any seats`);
    }

    const checkTicket = await Ticket.findOne({
      join: {
        alias: 'ticket',
        innerJoin: { showtime: 'ticket.showtime', seat: 'ticket.seat' },
      },
      where: (qb) => {
        qb.andWhere(`seat.id = ${seat.id}`).andWhere(
          `((showtime.startTime <= '${startTime.toISOString()}' AND '${startTime.toISOString()}' <= showtime.endTime)
          OR (showtime.startTime <= '${endTime.toISOString()}' AND '${endTime.toISOString()}' <= showtime.endTime)
          OR ('${startTime.toISOString()}' <= showtime.startTime AND showtime.startTime <= '${endTime.toISOString()}'))`,
        );
      },
      select: ['id'],
    });
    if (checkTicket) {
      throw new BadRequestException('Invalid time');
    }

    return await getManager()
      .transaction(async (entityManager) => {
        const showtime = await Showtime.create({
          startTime,
          endTime,
          advertiseTime,
          movie,
        });
        await entityManager.save(showtime);

        const ticketType = await TicketType.findOne({
          where: { name: TICKET_TYPE_NAME.NORMAL },
        });
        const tickets = room.seats.map((seat) => {
          return Ticket.create({
            seat,
            showtime,
            status: TICKET_STATUS.AVAILABLE,
            ticketType,
          });
        });
        await entityManager.save(tickets);

        return showtime;
      })
      .catch((err) => {
        throw new InternalServerErrorException(`Failed due to ${err}`);
      });
  }

  async getTicketsByShowtime(id: number) {
    const showtime = await Showtime.createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.tickets', 'ticket')
      .leftJoinAndSelect('ticket.seat', 'seat')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .where('showtime.id = :id', { id })
      .getOne();

    const room = await Room.createQueryBuilder('room')
      .leftJoin('room.seats', 'seat')
      .leftJoin('seat.tickets', 'ticket')
      .where('ticket.showtimeId = :id', { id })
      .getOne();

    return { ...showtime, room };
  }
}
