import { Cinema } from './cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CinemaRepository } from './cinema.repository';
import { Injectable } from '@nestjs/common';
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
}
