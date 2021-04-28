import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController extends BaseControllerCRUD<Transaction>{
    constructor(service:TransactionsService){
        super(service);
    }

    @Post()
    @Permissions(PermissionAction.CREATE_TRANSACTION)
    @UsePipes(ValidationPipe)
    createOne(@Body() createDto: CreateTransactionDto): Promise<Transaction> {
      return this.service.createOne(createDto);
    }
}
