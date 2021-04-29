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
}
