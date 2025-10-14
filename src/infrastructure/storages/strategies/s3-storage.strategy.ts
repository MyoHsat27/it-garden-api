import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { StorageStrategy } from './storage.interface';

@Injectable()
export class S3StorageStrategy implements StorageStrategy {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endPoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    this.endPoint = this.configService.getOrThrow<string>('S3_ENDPOINT');

    this.s3Client = new S3Client({
      endpoint: `http://${this.endPoint}`,
      forcePathStyle: true,
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET'),
      },
    });
  }

  async upload(
    file: Express.Multer.File,
    path: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    const key = `${path}/${uuid()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      }),
    );

    const url = `http://${this.endPoint}/${this.bucket}/${key}`;
    return { url, key };
  }
}
