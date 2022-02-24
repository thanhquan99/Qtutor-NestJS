import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { IdParam } from '../base/params';
import { ROLE } from '../constant';
import { StudentSubject, User } from '../db/models';
import { Role } from '../guards/role.decorator';
import { CreateStudentSubjectDto, UpdateStudentSubjectDto } from './dto';
import { StudentSubjectsService } from './student-subjects.service';

@Controller('student-subjects')
@ApiTags('Student Subject')
@UsePipes(ValidationPipe)
export class StudentSubjectsController {
  constructor(readonly service: StudentSubjectsService) {}

  @Post()
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createOne(
    @Body() payload: CreateStudentSubjectDto,
    @GetUser() user: User,
  ): Promise<StudentSubject> {
    return this.service.createOne(payload, user.id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  updateOne(
    @Body() payload: UpdateStudentSubjectDto,
    @GetUser() user: User,
    @Param() params: IdParam,
  ): Promise<StudentSubject> {
    return this.service.updateOne(params.id, payload, user.id);
  }
}
