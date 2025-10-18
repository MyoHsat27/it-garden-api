import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities';

@Injectable()
export class MediasRepository {
  constructor(
    @InjectRepository(Media)
    private readonly repo: Repository<Media>,
  ) {}

  async create(media: Partial<Media>): Promise<Media> {
    const entity = this.repo.create(media);
    return this.repo.save(entity);
  }

  async save(media: Media): Promise<Media> {
    return this.repo.save(media);
  }

  findById(id: number): Promise<Media | null> {
    return this.repo.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
