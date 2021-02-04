import { CreateCinemaDto } from './dto/create-cinema.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Cinema } from './cinema.entity';
import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';

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

  async getCinemas(filterDto: CinemasFilterDto): Promise<Cinema[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('cinema');

    if (search) {
      query.andWhere('cinema.name LIKE :search OR cinema.city LIKE :search', {
        search: `%${search}%`,
      });
    }

    const cinemas = await query.getMany();
    return cinemas;
  }
}
