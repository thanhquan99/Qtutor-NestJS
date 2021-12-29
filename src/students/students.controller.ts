import { TutorStudentsService } from './../tutor-students/tutor-students.service';
import {
  CreateStudentDto,
  RegisterStudyDto,
  UpdateStudentDto,
} from './dto/index';
import { IdParam } from './../base/params/index';
import { QueryParams } from './../base/dto/query-params.dto';
import { User, Student, Tutor } from 'src/db/models';
import { GetUser } from './../auth/get-user.decorator';
import { ROLE } from './../constant/index';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from 'src/guards/role.decorator';

@Controller('students')
export class StudentsController {
  public readonly service = new StudentsService();
  public readonly tutorStudentService = new TutorStudentsService();

  @Get('/me')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getMe(@GetUser() user: User): Promise<Student> {
    return this.service.getMe(user.id);
  }

  @Post('/me/tutor-students')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  async registerStudy(
    @Body() payload: RegisterStudyDto,
    @GetUser() user: User,
  ) {
    const student = await Student.query().findOne({ userId: user.id });
    if (!student) {
      throw new NotFoundException(
        'You are not a student. Please register to be a student',
      );
    }

    const tutor = await Tutor.query().findById(payload.tutorId);
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return this.service.registerStudy(payload, student, tutor);
  }

  @Get()
  @UsePipes(ValidationPipe)
  @Role(ROLE.OPTIONAL)
  @ApiBearerAuth()
  getMany(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: Student[]; total }> {
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
    return this.service.getStudents(query, user?.id);
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  getOne(@Param() params: IdParam): Promise<Student> {
    return this.service.getOne(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createOne(@Body() payload: CreateStudentDto, @GetUser() user: User) {
    return this.service.createStudent(payload, user.id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateOne(
    @Body() payload: UpdateStudentDto,
    @Param() params: IdParam,
  ): Promise<Student> {
    return this.service.updateOne(params.id, payload);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  deleteOne(@Param() params: IdParam): Promise<{ message: string }> {
    return this.service.deleteOne(params.id);
  }
}
