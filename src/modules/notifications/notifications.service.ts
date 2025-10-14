import { Injectable } from '@nestjs/common';
import { EmailProducer } from '../../infrastructure/queues/email';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailProducer: EmailProducer,
    // private readonly smsProducer: SmsProducer,
    // private readonly pushProducer: PushProducer,
  ) {}

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    await this.emailProducer.sendVerificationEmail(to, otp);
  }

  // async sendSms(to: string, message: string): Promise<void> {
  //   await this.smsProducer.sendSms(to, message);
  // }

  // async sendPushNotification(deviceToken: string, data: any): Promise<void> {
  //   await this.pushProducer.sendPush(deviceToken, data);
  // }
}
