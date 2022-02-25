import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { QueryParams } from '../base/dto/query-params.dto';
import { IdParam } from '../base/params';
import { ROLE } from '../constant';
import { Student, Tutor, User } from '../db/models';
import { Role } from '../guards/role.decorator';
import { SALoginDto, SAUpdateTutorDto } from './dto';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
@UsePipes(ValidationPipe)
@ApiTags('Super Admin')
export class SuperAdminController {
  constructor(public readonly service: SuperAdminService) {}

  @Post('/auth/login')
  login(
    @Body() payload: SALoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.service.login(payload);
  }

  @Get('/system-dashboard')
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  getDashboard(): Promise<{
    totalUsers: string;
    totalStudents: string;
    totalTutors: string;
    totalSubjects: string;
    totalCourses: string;
  }> {
    return this.service.getDashboard();
  }

  @Get('/tutors')
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  getTutors(
    @Query() query: QueryParams,
  ): Promise<{ results: Tutor[]; total: number }> {
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

    return this.service.getTutors(query);
  }

  @Get('/students')
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  getStudents(
    @Query() query: QueryParams,
  ): Promise<{ results: Student[]; total: number }> {
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

    return this.service.getStudents(query);
  }

  @Patch('/tutors/:id')
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  updateOneTutor(
    @Body() payload: SAUpdateTutorDto,
    @Param() params: IdParam,
  ): Promise<Tutor> {
    return this.service.updateOneTutor(params.id, payload);
  }

  @Patch('/students/:id')
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  updateOneStudent(
    @Body() payload: SAUpdateTutorDto,
    @Param() params: IdParam,
  ): Promise<Student> {
    return this.service.updateOneStudent(params.id, payload);
  }
}
