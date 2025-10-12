import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "./logger";

@Global()
@Module({
  imports: [LoggerModule],
})
export class CommonModule {}
