import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './ratings.entity';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController extends BaseControllerCRUD<Rating> {
    constructor(service:RatingsService){
        super(service);
    }

    @Post()
    // @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    createOne(@Body() createDto: CreateRatingDto): Promise<Rating> {
      return this.service.createOne(createDto);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteRatingById(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.service.deleteOne(id);
    }
  
    @Patch('/:id')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    updateTransaction(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateRatingDto: UpdateRatingDto,
    ): Promise<Rating> {
      return this.service.updateOne(id, updateRatingDto);
    }
}
