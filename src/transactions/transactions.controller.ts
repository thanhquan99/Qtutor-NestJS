import { TransactionsService } from './transactions.service';
import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { QueryParams } from '../base/dto/query-params.dto';
import { ROLE } from '../constant';
import { Transaction, User } from '../db/models';
import { Role } from '../guards/role.decorator';

@Controller('transactions')
@UsePipes(ValidationPipe)
export class TransactionsController {
  constructor(public readonly service: TransactionsService) {}

  @Get('/me')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMe(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: Transaction[]; total }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    if (query.customFilter) {
      query.customFilter = JSON.parse(query.customFilter);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;

    return this.service.getMe(user.id, query);
  }
}
