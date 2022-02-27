import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { IdParam } from '../base/params';
import { ROLE } from '../constant';
import { TutorSubject, User } from '../db/models';
import { Role } from '../guards/role.decorator';
import { CreateTutorSubjectDto, UpdateTutorSubjectDto } from './dto';
import { TutorSubjectsService } from './tutor-subjects.service';

@Controller('tutor-subjects')
@ApiTags('Tutor Subject')
@UsePipes(ValidationPipe)
export class TutorSubjectsController {
  constructor(readonly service: TutorSubjectsService) {}

  @Post()
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createOne(
    @Body() payload: CreateTutorSubjectDto,
    @GetUser() user: User,
  ): Promise<TutorSubject> {
    return this.service.createOne(payload, user.id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  updateOne(
    @Body() payload: UpdateTutorSubjectDto,
    @GetUser() user: User,
    @Param() params: IdParam,
  ): Promise<TutorSubject> {
    return this.service.updateOne(params.id, payload, user.id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  deleteOne(
    @GetUser() user: User,
    @Param() params: IdParam,
  ): Promise<{ message: string }> {
    return this.service.deleteOne(params.id, user.id);
  }
}
