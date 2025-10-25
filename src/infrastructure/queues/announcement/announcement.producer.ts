import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementProducer {
  constructor(@InjectQueue('announcement') private readonly queue: Queue) {}

  async scheduleDispatch(announcementId: number, payload: any, delay = 0) {
    await this.queue.add(
      'dispatch_announcement',
      { announcementId, payload },
      { delay, attempts: 3 },
    );
  }
}
