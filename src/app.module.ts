import { CronJobsModule } from './cron-job/cron-jobs.module';
import { RoleGuard } from './guards/role.guard';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { TutorsModule } from './tutors/tutors.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { TutorStudentsModule } from './tutor-students/tutor-students.module';
import { NotificationModule } from './notification/notification.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'Gmail',
          auth: {
            user: 'sangnh99@gmail.com',
            pass: 'ivmemwcmwxaeabpr',
          },
        },
        defaults: {
          from: '"QTutor" <no-reply@Qtutor.nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TutorsModule,
    AuthModule,
    UsersModule,
    CitiesModule,
    SubjectsModule,
    StudentsModule,
    TutorStudentsModule,
    NotificationModule,
    SchedulesModule,
    AppConfigModule,
    CronJobsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
