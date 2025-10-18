import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';
import { StorageStrategy } from './storage.interface';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  async upload(
    file: Express.Multer.File,
    path: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    const folderPath = join(this.uploadRoot, path);
    await fs.mkdir(folderPath, { recursive: true });

    const fileName = `${uuid()}-${file.originalname}`;
    const filePath = join(folderPath, fileName);

    await fs.writeFile(filePath, file.buffer);

    const url = `${process.env.APP_URL ?? 'http://localhost:3000'}/static/${
      path ? path + '/' : ''
    }${fileName}`;

    return {
      url,
      key: path ? `${path}/${fileName}` : fileName,
    };
  }
}
