import {
  Body,
  Controller,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParam } from '../base/params';
import { ROLE } from '../constant';
import { TutorStudent, User } from '../db/models';
import { ModelFields } from '../db/models/BaseModel';
import { Role } from '../guards/role.decorator';
import { GetUser } from './../auth/get-user.decorator';
import { UpdateTutorStudentDto } from './dto';
import { TutorStudentsService } from './tutor-students.service';

@Controller('tutor-students')
@ApiTags('Tutor Student')
@UsePipes(ValidationPipe)
export class TutorStudentsController {
  public readonly service = new TutorStudentsService();

  @Patch('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  updateOne(
    @GetUser() user: User,
    @Param() params: IdParam,
    @Body() payload: UpdateTutorStudentDto,
  ): Promise<ModelFields<TutorStudent>> {
    return this.service.updateTutorStudent(params.id, user.id, payload);
  }
}
