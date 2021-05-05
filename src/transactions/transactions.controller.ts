import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    createOne(@Body() createDto: CreateTransactionDto): Promise<Transaction> {
      return this.service.createOne(createDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    getTransaction() {
      return this.service.getTransaction();
    }

    @Delete('/:id')
    @Permissions(PermissionAction.DELETE_CINEMA)
    deleteCinemaById(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this..deleteCinemaById(id);
    }
  
    @Patch('/:id')
    @Permissions(PermissionAction.UPDATE_CINEMA)
    @UsePipes(ValidationPipe)
    updateCinema(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCinemaDto: UpdateCinemaDto,
    ): Promise<Cinema> {
      return this.cinemaService.updateCinema(id, updateCinemaDto);
    }
}
