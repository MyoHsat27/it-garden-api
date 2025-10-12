import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { bullMqAsyncConfig } from "src/config/bullmq.config";

@Global()
@Module({
  imports: [BullModule.forRootAsync(bullMqAsyncConfig)],
})
export class BullMQModule {}
