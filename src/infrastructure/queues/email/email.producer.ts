import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue("email") private readonly emailQueue: Queue) {}

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const jobName = "send-verification-email";
    const jobData = { to, otp };
    await this.emailQueue.add(jobName, jobData);
  }
}
