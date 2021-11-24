import { CreateCityDto, UpdateCityDto } from './dto/index';
import { IdParam } from 'src/base/params';
import { CitiesService } from './cities.service';
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

@Controller('cities')
export class CitiesController {
  public readonly service = new CitiesService();

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
  createOne(@Body() payload: CreateCityDto): Promise<City> {
    return this.service.createOne(payload);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  updateOne(
    @Body() payload: UpdateCityDto,
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
