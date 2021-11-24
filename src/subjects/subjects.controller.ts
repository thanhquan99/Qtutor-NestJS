import { CreateSubjectDto, UpdateSubjectDto } from './dto/index';
import { SubjectsService } from './subjects.service';
import { IdParam } from 'src/base/params';
import { City } from 'src/db/models';
import { QueryParams } from 'src/base/dto/query-params.dto';
import { Role } from 'src/guards/role.decorator';
import { ROLE } from 'src/constant';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('subjects')
export class SubjectsController {
  public readonly service = new SubjectsService();

  @Get()
  @UsePipes(ValidationPipe)
  getMany(
    @Query() query: QueryParams,
  ): Promise<{ results: City[]; total: number }> {
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
  getOne(@Param() params: IdParam): Promise<City> {
    return this.service.getOne(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  createOne(@Body() payload: CreateSubjectDto): Promise<City> {
    return this.service.createOne(payload);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  updateOne(
    @Body() payload: UpdateSubjectDto,
    @Param() params: IdParam,
  ): Promise<City> {
    return this.service.updateOne(params.id, payload);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  deleteOne(@Param() params: IdParam): Promise<{ message: string }> {
    return this.service.deleteOne(params.id);
  }
}
