import { Injectable, Inject } from '@nestjs/common';
import { StorageStrategy } from './strategies/storage.interface';
@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_STRATEGY')
    private readonly storageStrategy: StorageStrategy,
  ) {}

  upload(file: Express.Multer.File, path?: string) {
    return this.storageStrategy.upload(file, path);
  }
}
