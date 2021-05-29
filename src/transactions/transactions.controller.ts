import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './../users/user.entity';
import { QueryParams } from './../base/dto/query-params.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getMyTransactions(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: Transaction[]; total: number }> {
    try {
      if (query?.filter) {
        query.filter = JSON.parse(query.filter);
      }
      if (query?.orderBy) {
        query.orderBy = JSON.parse(query.orderBy);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return this.service.getMyTransactions(query, user.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateTransactionDto): Promise<Transaction> {
    return this.service.createOne(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getMany(@Query() query: QueryParams) {
    return this.service.getMany(query);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_TRANSACTION)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_TRANSACTION)
  @UsePipes(ValidationPipe)
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.service.updateOne(id, updateTransactionDto);
  }
}
