import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLE } from '../constant';
import { User } from '../db/models';
import { Role } from '../guards/role.decorator';
import { SALoginDto } from './dto';
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
  }> {
    return this.service.getDashboard();
  }
}
