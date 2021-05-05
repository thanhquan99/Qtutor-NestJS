import { TicketType } from './ticket-type.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketTypesService extends BaseServiceCRUD<TicketType> {
  constructor(@InjectRepository(TicketType) repo) {
    super(repo, TicketType, 'ticket-type');
  }
}
