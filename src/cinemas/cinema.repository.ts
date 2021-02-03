import { CreateCinemaDto } from './dto/create-cinema.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Cinema } from './cinema.entity';

@EntityRepository(Cinema)
export class CinemaRepository extends Repository<Cinema> {
  async createCinema(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const { name, city } = createCinemaDto;

    const cinema = new Cinema();
    cinema.name = name;
    cinema.city = city;
    await cinema.save();

    return cinema;
  }
}
