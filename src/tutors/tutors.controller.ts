import { ROLE } from './../constant/index';
import { GetUser } from './../auth/get-user.decorator';
import { CreateTutorDto, UpdateTutorDto } from './dto/index';
import { QueryParams } from 'src/base/dto/query-params.dto';
import { TutorsService } from './tutors.service';
import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import Tutor from 'src/db/models/Tutor';
import { IdParam } from 'src/base/params';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/db/models';
import { Role } from 'src/guards/role.decorator';

@Controller('tutors')
export class TutorsController {
  public readonly service = new TutorsService();

  @Get('/me')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getMe(@GetUser() user: User): Promise<Tutor> {
    return this.service.getMe(user.id);
  }

  @Get('/suggestion')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getSuggestion(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: Tutor[]; total }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getSuggestion(query, user.id);
  }

  @Get()
  @UsePipes(ValidationPipe)
  getMany(@Query() query: QueryParams): Promise<{ results: Tutor[]; total }> {
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
  getOne(@Param() params: IdParam): Promise<Tutor> {
    return this.service.getOne(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createOne(@Body() payload: CreateTutorDto, @GetUser() user: User) {
    return this.service.createTutor(payload, user.id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateOne(
    @Body() payload: UpdateTutorDto,
    @Param() params: IdParam,
  ): Promise<Tutor> {
    return this.service.updateOne(params.id, payload);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  deleteOne(@Param() params: IdParam): Promise<{ message: string }> {
    return this.service.deleteOne(params.id);
  }
}
