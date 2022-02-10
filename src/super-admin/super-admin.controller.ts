import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../db/models';
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
}
