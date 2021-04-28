import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Rating } from './ratings.entity';

@Injectable()
export class RatingsService extends BaseServiceCRUD<Rating> {
    constructor(@InjectRepository(Rating) repo){
        super(repo,Rating, "rating");
    }
}
