import { QueryParams } from './../base/dto/query-params.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateTransactionDto): Promise<Transaction> {
    return this.service.createOne(createDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  getMany(@Query() query: QueryParams) {
    return this.service.getMany(query);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_TRANSACTION)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Patch('/:id')
  @Permissions(PermissionAction.UPDATE_TRANSACTION)
  @UsePipes(ValidationPipe)
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.service.updateOne(id, updateTransactionDto);
  }
}
