import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
    switch (job.name) {
      case 'send-verification-email':
        await this.processVerify(job);
        break;
      case 'send-forgot-password-email':
        await this.processForgotPassword(job);
        break;
      case 'send-email':
        await this.handleSendEmail(job);
        break;
      default:
        this.logger.warn(`No handler for job name: ${job.name}`);
        break;
    }
  }

  async processVerify(job: Job) {
    const { to, otp } = job.data;
    await this.emailService.sendVerificationOtp(to, otp);
  }

  async processForgotPassword(job: Job) {
    const { to, token } = job.data;
    await this.emailService.sendForgotPassword(to, token);
  }

  async handleSendEmail(job: Job) {
    const { to, subject, html, text } = job.data;
    await this.emailService.sendMail({ to, subject, html, text });
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
