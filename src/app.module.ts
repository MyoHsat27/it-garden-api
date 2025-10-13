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
  HealthModule,
  MediasModule,
  NotificationsModule,
  UsersModule,
} from './modules';
import { AdminsModule } from './modules/admins/admins.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { BatchesModule } from './modules/batches/batches.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClassroomsModule } from './modules/classrooms/classrooms.module';
import { TimeslotsModule } from './modules/timeslots/time-slots.module';
import { TimetablesModule } from './modules/timetables/timetables.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { AttedanceRecordsModule } from './modules/attendance-records/attedance-records.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ExamResultsModule } from './modules/exam-results/exam-results.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { PaymentsModule } from './modules/payments/payments.module';

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

    MediasModule,

    NotificationsModule,

    AdminsModule,

    TeachersModule,

    RolesModule,

    PermissionsModule,

    BatchesModule,

    CoursesModule,

    ClassroomsModule,

    TimeslotsModule,

    TimetablesModule,

    AssignmentsModule,

    SubmissionsModule,

    AttedanceRecordsModule,

    EnrollmentsModule,

    ExamsModule,

    ExamResultsModule,

    AnnouncementsModule,

    PaymentsModule,
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
