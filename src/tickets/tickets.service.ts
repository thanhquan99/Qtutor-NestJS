import { Ticket } from './ticket.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketsService extends BaseServiceCRUD<Ticket> {
  constructor(@InjectRepository(Ticket) repo) {
    super(repo, Ticket, 'ticket');
  }
}
