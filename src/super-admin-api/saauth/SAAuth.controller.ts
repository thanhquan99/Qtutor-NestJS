import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../db/models';
import { SALoginDto } from './dto';
import { SAAuthService } from './SAAuth.service';

@Controller('super-admin/auth')
@UsePipes(ValidationPipe)
@ApiTags('Super Admin Auth')
export class SAAuthController {
  constructor(public readonly service: SAAuthService) {}

  @Post('/login')
  login(
    @Body() payload: SALoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.service.login(payload);
  }
}
