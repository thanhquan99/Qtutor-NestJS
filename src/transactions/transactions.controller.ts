import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController extends BaseControllerCRUD<Transaction>{
    constructor(service:TransactionsService){
        super(service);
    }

    @Post()
    @Permissions(PermissionAction.CREATE_RATING)
    @UsePipes(ValidationPipe)
    createOne(@Body() createDto: CreateRatingDto): Promise<Rating> {
      return this.service.createOne(createDto);
    }
}
