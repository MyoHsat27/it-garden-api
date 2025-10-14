import { Module, Provider } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { LocalStorageStrategy, S3StorageStrategy } from './strategies';

const StorageStrategyProvider: Provider = {
  provide: 'STORAGE_STRATEGY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const driver = configService.get<string>('STORAGE_DRIVER') || 'local';
    return driver === 's3'
      ? new S3StorageStrategy(configService)
      : new LocalStorageStrategy();
  },
};

@Module({
  providers: [StorageService, StorageStrategyProvider],
  exports: [StorageService],
})
export class StorageModule {}
