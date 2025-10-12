import { ConfigModule, ConfigService } from "@nestjs/config";

export const bullMqAsyncConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.get<string>("REDIS_HOST"),
      port: configService.get<number>("REDIS_PORT"),
      password: configService.get<string>("REDIS_PASSWORD"),
    },
  }),
  inject: [ConfigService],
};
