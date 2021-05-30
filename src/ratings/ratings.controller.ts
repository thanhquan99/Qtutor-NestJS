import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './ratings.entity';
import { RatingsService } from './ratings.service';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('ratings')
export class RatingsController extends BaseControllerCRUD<Rating> {
  constructor(service: RatingsService) {
    super(service);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions('')
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateRatingDto): Promise<Rating> {
    return this.service.createOne(createDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions('')
  deleteRatingById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteOne(id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions('')
  @UsePipes(ValidationPipe)
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.service.updateOne(id, updateRatingDto);
  }
}
