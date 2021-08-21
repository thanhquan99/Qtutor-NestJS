import { ShowtimeQueryParams } from './dto/index';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from './showtimes.entity';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController extends BaseControllerCRUD<Showtime> {
  constructor(service: ShowtimesService) {
    super(service);
  }

  @Get()
  getMany(
    @Query(ValidationPipe) query: ShowtimeQueryParams,
  ): Promise<{ results: any; total: number }> {
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

    return this.service.getMany(query);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_SHOWTIME)
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateShowtimeDto): Promise<Showtime> {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_SHOWTIME)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_SHOWTIME)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }

  @Get('/:id/tickets')
  getTicketsByShowtime(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTicketsByShowtime(id);
  }
}
