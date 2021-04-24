import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Theater } from './../theaters/theater.entity';
import { Cinema } from './cinema.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTheaterDto } from 'src/theaters/dto/create-theater.dto';
import { getManager } from 'typeorm';

@Injectable()
export class CinemaService extends BaseServiceCRUD<Cinema> {
  constructor(@InjectRepository(Cinema) repo) {
    super(repo, Cinema, 'cinema');
  }

  async getOwnTheaters(id: number) {
    return await Cinema.createQueryBuilder('cinema')
      .where('cinema.id = :id', { id })
      .leftJoinAndSelect('cinema.theaters', 'theater')
      .getOne();
  }

  async createOwnTheater(
    id: number,
    createTheaterDto: CreateTheaterDto,
  ): Promise<Cinema> {
    const { theaterNumber } = createTheaterDto;
    const manager = getManager();

    const checkTheater = await manager
      .createQueryBuilder(Theater, 'theater')
      .where('"cinemaId" = :id and "theaterNumber" = :theaterNumber', {
        id,
        theaterNumber,
      })
      .getOne();
    if (checkTheater) {
      throw new BadRequestException(
        `Theater Number ${theaterNumber} is already exist in this cinema`,
      );
    }

    const cinema = await Cinema.findOne({
      where: { id },
    });
    const theater = Theater.create(createTheaterDto);
    cinema.theaters.push(theater);
    return cinema.save();
  }
}
