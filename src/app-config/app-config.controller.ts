import { AppConfigService } from './app-config.service';
import { Controller, Get } from '@nestjs/common';

@Controller('app-config')
export class AppConfigController {
  constructor(private appConfigService: AppConfigService) {}

  @Get()
  getAppConfig() {
    return this.appConfigService.getAppConfig();
  }
}
