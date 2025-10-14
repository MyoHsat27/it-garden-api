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
} from './common';
import {
  BullBoardModule,
  BullMQModule,
  QueuesModule,
  TypeOrmModule,
} from './infrastructure';
import { AdminsModule } from './modules/admins/admins.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { BatchesModule } from './modules/batches/batches.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClassroomsModule } from './modules/classrooms/classrooms.module';
import { TimetablesModule } from './modules/timetables/timetables.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { AttendanceRecordsModule } from './modules/attendance-records/attendance-records.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ExamResultsModule } from './modules/exam-results/exam-results.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TimeSlotsModule } from './modules/time-slots/time-slots.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MediasModule } from './modules/medias/medias.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StudentsModule } from './modules/students/students.module';

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
    HealthModule,

    // Feature modules
    AuthModule,

    UsersModule,

    MediasModule,

    NotificationsModule,

    AdminsModule,

    StudentsModule,

    TeachersModule,

    RolesModule,

    PermissionsModule,

    BatchesModule,

    CoursesModule,

    ClassroomsModule,

    TimeSlotsModule,

    TimetablesModule,

    AssignmentsModule,

    SubmissionsModule,

    AttendanceRecordsModule,

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
