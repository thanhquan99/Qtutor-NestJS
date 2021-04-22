import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Showtime } from './showtimes.entity';

@Injectable()
export class ShowtimesService extends BaseServiceCRUD<Showtime>{
    constructor(@InjectRepository(Showtime) repo) {
        super(repo,Showtime, "showtime");
      }
}
