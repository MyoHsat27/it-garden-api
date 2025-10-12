import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CommonModule,
  RequestLoggingMiddleware,
  APP_RATE_LIMIT,
  APP_RATE_TTL,
} from '@common';
import {
  BullBoardModule,
  BullMQModule,
  QueuesModule,
  TypeOrmModule,
} from './infrastructure';
import {
  AuthModule,
  AvatarsModule,
  EducatorsModule,
  HealthModule,
  LearnersModule,
  MediasModule,
  NotificationsModule,
  TagsModule,
  UsersModule,
  ProfilesModule,
} from './modules';

@Module({
  imports: [
    // Load configuration globally
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      cache: true,
      isGlobal: true,
    }),

    // Infrastructure modules
    TypeOrmModule,
    BullMQModule,
    QueuesModule,
    BullBoardModule,
    ThrottlerModule.forRoot([
      {
        ttl: APP_RATE_TTL,
        limit: APP_RATE_LIMIT,
      },
    ]),

    // Common modules
    CommonModule,

    // Feature modules
    HealthModule,

    AuthModule,

    UsersModule,

    EducatorsModule,

    LearnersModule,

    MediasModule,

    NotificationsModule,

    TagsModule,

    AvatarsModule,

    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
