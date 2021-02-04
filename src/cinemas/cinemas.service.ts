import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';
import { Cinema } from './cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CinemaRepository } from './cinema.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(CinemaRepository)
    private cinemaRepository: CinemaRepository,
  ) {}

  async createCinema(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.cinemaRepository.createCinema(createCinemaDto);
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
    return this.cinemaRepository.getCinemas(filterDto);
  }
}
