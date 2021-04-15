import { Theater } from './../theaters/theater.entity';
import { UpdateCinemaDto } from './dto/update-cinema-dto';
import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';
import { Cinema } from './cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CinemaRepository } from './cinema.repository';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTheaterDto } from 'src/theaters/dto/create-theater.dto';
import { getManager } from 'typeorm';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(CinemaRepository)
    private cinemaRepository: CinemaRepository,
  ) {}

  async createCinema(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const cinema = Cinema.create(createCinemaDto);
    await cinema.save();
    return cinema;
  }

  async getCinemaById(id: number): Promise<Cinema> {
    const cinemaFound = await this.cinemaRepository.findOne({
      where: { id },
    });

    if (!cinemaFound) {
      throw new NotFoundException(`Cinema with ${id} not found`);
    }

    return cinemaFound;
  }

  async getCinemas(filterDto: CinemasFilterDto): Promise<Cinema[]> {
    const { search } = filterDto;
    const query = this.cinemaRepository.createQueryBuilder('cinema');

    if (search) {
      query.andWhere(
        'cinema.name LIKE :search OR cinema.address LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const cinemas = await query.getMany();
    return cinemas;
  }

  async deleteCinemaById(id: number): Promise<void> {
    const result = await this.cinemaRepository.delete({
      id,
    });

    if (!result.affected) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
  }

  async updateCinema(
    id: number,
    updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return await this.cinemaRepository.save({ id, ...updateCinemaDto });
  }

  async getOwnTheaters(id: number) {
    return await this.cinemaRepository
      .createQueryBuilder('cinema')
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

    const cinema = await this.cinemaRepository.findOne({
      where: { id },
    });
    const theater = Theater.create(createTheaterDto);
    cinema.theaters.push(theater);
    return cinema.save();
  }
}
