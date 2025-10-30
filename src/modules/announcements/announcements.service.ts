import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  AnnouncementResponseDto,
  CreateAnnouncementDto,
  GetAnnouncementsQueryDto,
} from './dto';
import { AnnouncementsRepository } from './announcements.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities';
import { Announcement } from './entities';
import { NotificationChannel, PaginatedResponseDto } from '../../common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailProducer } from '../../infrastructure/queues/email';
import { Repository } from 'typeorm';
import { Batch } from '../batches/entities';
import { UserRole } from '../users/enums';
import { Enrollment } from '../enrollments/entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    private readonly announcementsRepo: AnnouncementsRepository,
    private readonly notificationsService: NotificationsService,
    private readonly emailProducer: EmailProducer,
    @InjectRepository(Batch) private readonly batchRepo: Repository<Batch>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(
    dto: CreateAnnouncementDto,
    author: User,
  ): Promise<Announcement> {
    this.logger.log(dto);
    const channels =
      dto.channels && dto.channels.length
        ? dto.channels
        : [NotificationChannel.WEB];

    const announcement = await this.announcementsRepo.create({
      title: dto.title,
      body: dto.body,
      batch: dto.batchId ? ({ id: dto.batchId } as any) : undefined,
      channels,
      author,
      publishAt: new Date(),
    });

    await this.dispatchAnnouncement(announcement.id);

    return announcement;
  }

  async dispatchAnnouncement(announcementId: number) {
    const announcement = await this.announcementsRepo.findOne(announcementId);
    if (!announcement) throw new NotFoundException('Announcement not found');

    const channels =
      announcement.channels && announcement.channels.length
        ? announcement.channels
        : [NotificationChannel.WEB];

    let recipients: User[] = [];
    if (announcement.batch && announcement.batch.id) {
      const batch = await this.batchRepo.findOne({
        where: { id: announcement.batch.id },
        relations: [
          'teacher',
          'teacher.user',
          'enrollments',
          'enrollments.student',
          'enrollments.student.user',
        ],
      });
      if (!batch) throw new NotFoundException('Batch not found');

      if (batch.teacher) recipients.push(batch.teacher.user);
      const students = (batch.enrollments || [])
        .map((e: Enrollment) => e.student.user)
        .filter(Boolean);
      recipients.push(...students);
    } else {
      const users = await this.userRepo.find({
        where: [{ userRole: UserRole.TEACHER }, { userRole: UserRole.STUDENT }],
      });
      recipients.push(...users);
    }

    const recipientsMap = new Map<number, User>();
    recipients.forEach((u) => {
      if (u && u.id !== announcement.author.id) recipientsMap.set(u.id, u);
    });
    const uniqueRecipients = Array.from(recipientsMap.values());

    const payload = {
      announcementId: announcement.id,
      title: announcement.title,
      body: announcement.body,
      batchId: announcement.batch?.id ?? null,
      authorId: announcement.author.id,
    };

    await Promise.all(
      uniqueRecipients.map(async (user) => {
        if (channels.includes(NotificationChannel.WEB)) {
          this.logger.log('INSIDE WEB');
          try {
            this.logger.log('TRYING TO SEND WEB');
            await this.notificationsService.createForUser(user, {
              title: announcement.title,
              body: announcement.body,
              type: 'announcement',
              channels,
              payloadData: payload,
              sourceId: announcement.id,
            });
          } catch (err) {
            this.logger.warn(
              `Failed to create notification for ${user.id}: ${err.message}`,
            );
          }
        }

        if (channels.includes(NotificationChannel.EMAIL) && user.email) {
          try {
            await this.emailProducer.sendMail({
              to: user.email,
              subject: `[Announcement] ${announcement.title}`,
              html: `<p>${announcement.body}</p>`,
              text: announcement.body,
            });
          } catch (err) {
            this.logger.warn(
              `Failed to enqueue email for ${user.id}: ${err.message}`,
            );
          }
        }
      }),
    );

    this.logger.log(
      `Announcement ${announcement.id} dispatched to ${uniqueRecipients.length} recipients`,
    );
    return true;
  }

  async findAllAnnouncementsWithFilters(query: GetAnnouncementsQueryDto) {
    const result = await this.announcementsRepo.findWithFilters(query);

    const data = result.data.map((a) =>
      plainToInstance(AnnouncementResponseDto, a),
    );

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findOne(id: number) {
    return this.announcementsRepo.findOne(id);
  }

  async remove(id: number) {
    return this.announcementsRepo.remove(id);
  }
}
