import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const jobName = 'send-verification-email';
    const jobData = { to, otp };
    await this.emailQueue.add(jobName, jobData);
  }

  async sendForgotPasswordEmail(to: string, token: string): Promise<void> {
    const jobName = 'send-forgot-password-email';
    const jobData = { to, token };
    await this.emailQueue.add(jobName, jobData);
  }

  async sendMail(payload: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }) {
    const jobName = 'send-email';
    await this.emailQueue.add(jobName, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }
}
