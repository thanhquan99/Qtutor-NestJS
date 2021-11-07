import {
  Body,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QueryParams } from 'src/base/dto/query-params.dto';
import { IdParam } from './params';

@Injectable()
export abstract class BaseControllerCRUD<T> {
  public readonly service;

  constructor(service) {
    this.service = service;
  }

  @Get()
  @UsePipes(ValidationPipe)
  getMany(@Query() query: QueryParams): Promise<{ results: T[]; total }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getMany(query);
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  getOne(@Param() params: IdParam): Promise<T> {
    return this.service.getOne(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createOne(@Body() payload): Promise<T> {
    return this.service.createOne(payload);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateOne(@Body() payload, @Param() params: IdParam): Promise<T> {
    return this.service.updateOne(params.id, payload);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  deleteOne(@Param() params: IdParam): Promise<{ message: string }> {
    return this.service.deleteOne(params.id);
  }
}
