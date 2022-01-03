import { AppConfigService } from './app-config.service';
import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('app-config')
export class AppConfigController {
  public readonly service = new AppConfigService();

  @Get()
  @UsePipes(ValidationPipe)
  getMany() {
    return this.service.getMany();
  }
}
