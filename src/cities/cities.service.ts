import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { City } from 'src/db/models';

@Injectable()
export class CitiesService extends BaseServiceCRUD<City> {
  constructor() {
    super(City, 'City');
  }
}
