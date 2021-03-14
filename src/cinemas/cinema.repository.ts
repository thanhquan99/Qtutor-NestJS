import { EntityRepository, Repository } from 'typeorm';
import { Cinema } from './cinema.entity';

@EntityRepository(Cinema)
export class CinemaRepository extends Repository<Cinema> {}
