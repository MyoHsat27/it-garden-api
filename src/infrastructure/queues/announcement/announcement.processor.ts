import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AnnouncementsService } from '../../../modules/announcements/announcements.service';

@Processor('announcement')
export class AnnouncementProcessor extends WorkerHost {
  private readonly logger = new Logger(AnnouncementProcessor.name);

  constructor(private readonly announcementsService: AnnouncementsService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
    const { announcementId, payload } = job.data;
    this.logger.log(`Dispatching announcement ${announcementId}`);
    await this.announcementsService.dispatchAnnouncement(announcementId);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} of type ${job.name} has completed.`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} has failed with error: ${err.message}`);
  }
}
