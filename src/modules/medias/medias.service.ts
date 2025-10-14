import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities';
import * as sharp from 'sharp';
import { StorageService } from '../../infrastructure';
import { MediaType } from '../../common';

@Injectable()
export class MediasService {
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    private readonly storageService: StorageService,
  ) {}

  async uploadAndCreateMedia(
    file: Express.Multer.File,
    type: MediaType,
    altText?: string,
  ): Promise<Media> {
    if (!file) throw new BadRequestException('File is required.');

    const { url } = await this.storageService.upload(file, 'avatars');
    const { width, height, size } = await sharp(file.buffer).metadata();

    const newMedia = this.mediaRepo.create({
      url,
      type,
      mimeType: file.mimetype,
      size,
      width,
      height,
      altText,
      // createdBy: userId
    });

    return this.mediaRepo.save(newMedia);
  }

  async findMediaByIdAndType(
    id: number,
    expectedType: MediaType,
  ): Promise<Media> {
    const media = await this.mediaRepo.findOneBy({ id });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
    if (media.type !== expectedType) {
      throw new BadRequestException(
        `Media with ID ${id} is not of the required type '${expectedType}'.`,
      );
    }
    return media;
  }
}
