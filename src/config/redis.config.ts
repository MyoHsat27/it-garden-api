import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheableMemory } from "cacheable";
import { createKeyv } from "@keyv/redis";
import { Keyv } from "keyv";

export const redisCacheModuleAsync: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    stores: [
      createKeyv(
        `redis://${configService.get<string>("REDIS_HOST", "localhost")}:${configService.get<number>("REDIS_PORT", 6379)}`,
      ),
      new Keyv({
        store: new CacheableMemory({
          ttl: configService.get<number>("CACHE_TTL", 60000),
          lruSize: configService.get<number>("CACHE_LRUSIZE", 5000),
        }),
      }),
    ],
  }),
};
