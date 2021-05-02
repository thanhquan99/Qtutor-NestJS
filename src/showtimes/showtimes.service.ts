import {
  TicketType,
  TicketTypeName,
} from './../ticket-types/ticket-type.entity';
import { Ticket, TicketStatus } from './../tickets/ticket.entity';
import { Room } from './../rooms/room.entity';
import { Movie } from './../movies/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Showtime } from './showtimes.entity';
import { getManager } from 'typeorm';

@Injectable()
export class ShowtimesService extends BaseServiceCRUD<Showtime> {
  constructor(@InjectRepository(Showtime) repo) {
    super(repo, Showtime, 'showtime');
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
          where: { name: TicketTypeName.NORMAL },
        });
        const tickets = room.seats.map((seat) => {
          return Ticket.create({
            seat,
            showtime,
            status: TicketStatus.AVAILABLE,
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
}
