import { ConfigModule, ConfigService } from "@nestjs/config";

export const jwtConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: configService.get<number>("DB_PORT", 3306),
    username: configService.get<string>("DB_USER", "root"),
    password: configService.get<string>("DB_PASSWORD", "secret"),
    database: configService.get<string>("DB_NAME", "maymyan"),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>("DB_SYNC", false),
    logging: configService.get<boolean>("DB_LOGGING", false),
  }),
  inject: [ConfigService],
};
