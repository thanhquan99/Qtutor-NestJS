import {
  Body,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { QueryParams } from 'src/base/dto/query-params.dto';

@Injectable()
export abstract class BaseControllerCRUD<T> {
  public readonly service;

  constructor(service) {
    this.service = service;
  }

  @Get()
  getMany(
    @Query(ValidationPipe) query: QueryParams,
  ): Promise<{ results: T[]; total: number }> {
    if (query?.filter) {
      query.filter = JSON.parse(query.filter);
    }
    return this.service.getMany(query);
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.service.getOne(id);
  }

  @Post()
  createOne(@Body() createDto: any): Promise<T> {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: any,
  ): Promise<T> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
}
