import { AppInfoDto } from './common/dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  private readonly appInfo: AppInfoDto = {
    name: 'MayMyan APIs',
    version: '1.0.0',
    description: '',
    web: {
      version: '1.0.0',
      lastUpdate: '',
    },
    mobile: {
      ios: {
        version: '',
        lastUpdate: '',
      },
      android: {
        version: '',
        lastUpdate: '',
      },
    },
  };

  getAppInfo() {
    return this.appInfo;
  }

  async getHello() {
    return 'Hello World!';
  }
}
