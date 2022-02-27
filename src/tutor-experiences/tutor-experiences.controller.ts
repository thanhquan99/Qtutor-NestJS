import { TutorExperiencesService } from './tutor-experiences.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '../guards/role.decorator';
import { ROLE } from '../constant';
import { CreateTutorExperienceDto } from './dto';
import { TutorExperience, User } from '../db/models';
import { GetUser } from '../auth/get-user.decorator';
import { IdParam } from '../base/params';

@Controller('tutor-experiences')
@ApiTags('Tutor Experience')
@UsePipes(ValidationPipe)
export class TutorExperiencesController {
  constructor(readonly service: TutorExperiencesService) {}

  @Post()
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  createOne(
    @Body() payload: CreateTutorExperienceDto,
    @GetUser() user: User,
  ): Promise<TutorExperience> {
    return this.service.createOne(payload, user.id);
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
