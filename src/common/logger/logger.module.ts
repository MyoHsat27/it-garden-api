import { Module } from "@nestjs/common";
import { AppLogger } from "./app-logger.service";
import { WinstonConfigService } from "./winston.config";
import { WinstonModule } from "nest-winston";

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
