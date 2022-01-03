import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/db/models';

@Injectable()
export class AppConfigService {
  async getMany() {
    const configs = await AppConfig.query();
    const result = {};
    configs.forEach((config) => {
      result[config.name] = config.value;
    });

    return result;
  }
}
