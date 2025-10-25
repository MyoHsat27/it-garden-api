import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities';
import { GetAnnouncementsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class AnnouncementsRepository {
  constructor(
    @InjectRepository(Announcement)
    private readonly repo: Repository<Announcement>,
  ) {}
  create(entity: Partial<Announcement>) {
    const ent = this.repo.create(entity);
    return this.repo.save(ent);
  }

  async findAll() {
    return this.repo.find({
      relations: ['author', 'batch'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetAnnouncementsQueryDto,
  ): Promise<PaginatedResponseDto<Announcement>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.author', 'author')
      .leftJoinAndSelect('announcement.batch', 'batch')
      .orderBy('announcement.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(announcement.title ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      data,
      page,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['author', 'batch'],
    });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { success: true };
  }
}
