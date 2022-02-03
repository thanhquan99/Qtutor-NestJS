import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { QueryParams } from '../base/dto/query-params.dto';
import { IdParam } from '../base/params';
import { ROLE } from '../constant';
import { Transaction, User } from '../db/models';
import { ModelFields } from '../db/models/BaseModel';
import { Role } from '../guards/role.decorator';
import {
  CreatePaypalPaymentDto,
  ExecutePaypalPaymentDto,
  UpdateTransactionDto,
} from './dto';
import { TransactionsService } from './transactions.service';

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

  @Patch('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  updateTransaction(
    @Param() params: IdParam,
    @Body() payload: UpdateTransactionDto,
    @GetUser() user: User,
  ): Promise<ModelFields<Transaction>> {
    return this.service.updateTransaction(params.id, payload, user.id);
  }

  @Post('/:id/paypal/execution')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  executePayment(
    @Param() params: IdParam,
    @Body() payload: ExecutePaypalPaymentDto,
    @GetUser() user: User,
  ): Promise<ModelFields<Transaction>> {
    return this.service.executePayment(params.id, payload, user.id);
  }

  @Post('/:id/paypal/payment')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createPayment(
    @Param() params: IdParam,
    @GetUser() user: User,
    @Body() payload: CreatePaypalPaymentDto,
  ): Promise<{ paypalPaymentUrl: string }> {
    return this.service.createPayment(params.id, payload, user.id);
  }
}
