import { ROLE } from './../constant/index';
import { GetUser } from './../auth/get-user.decorator';
import {
  CreateTutorDto,
  UpdateTutorDto,
  RegisterTeachingDto,
  CreateTutorRatingDto,
} from './dto/index';
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
  NotFoundException,
} from '@nestjs/common';
import Tutor from 'src/db/models/Tutor';
import { IdParam } from 'src/base/params';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Student, TutorStudent, User, TutorRating } from 'src/db/models';
import { Role } from 'src/guards/role.decorator';

@Controller('tutors')
@ApiTags('Tutor')
export class TutorsController {
  constructor(public readonly service: TutorsService) {}

  @Get('/me')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getMe(@GetUser() user: User): Promise<Tutor> {
    return this.service.getMe(user.id);
  }

  @Get('/my-suggestions')
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

  @Post('/my-teachings')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  async registerTeaching(
    @Body() payload: RegisterTeachingDto,
    @GetUser() user: User,
  ): Promise<TutorStudent> {
    const tutor = await Tutor.query().findOne({ userId: user.id });
    if (!tutor) {
      throw new NotFoundException(
        'You are not a tutor. Please register to be a tutor',
      );
    }

    const student = await Student.query().findById(payload.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.service.registerTeaching(payload, student, tutor);
  }

  @Get('/my-teachings')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getMyTeachings(
    @GetUser() user: User,
    @Query() query: QueryParams,
  ): Promise<{ results: TutorStudent[]; total: number }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getMyTeachings(query, user.id);
  }

  @Get()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.OPTIONAL)
  getMany(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: Tutor[]; total }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    if (query.customFilter) {
      query.customFilter = JSON.parse(query.customFilter);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getTutors(query, user?.id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @Role(ROLE.OPTIONAL)
  @UsePipes(ValidationPipe)
  getTutor(@Param() params: IdParam, @GetUser() user: User): Promise<Tutor> {
    return this.service.getTutor(params.id, user?.id);
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

  @Get('/:id/ratings')
  @UsePipes(ValidationPipe)
  getRatings(
    @Param() params: IdParam,
    @Query() query: QueryParams,
  ): Promise<{ results: any[]; total: number }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getRatings(params.id, query);
  }

  @Post('/:id/ratings')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createTutorRating(
    @Body() payload: CreateTutorRatingDto,
    @GetUser() user: User,
    @Param() params: IdParam,
  ): Promise<TutorRating> {
    return this.service.createTutorRating(params.id, payload, user.id);
  }

  @Post('/:id/rated-examination')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  checkRated(
    @GetUser() user: User,
    @Param() params: IdParam,
  ): Promise<{ canRating: boolean }> {
    return this.service.checkRated(user.id, params.id);
  }
}
