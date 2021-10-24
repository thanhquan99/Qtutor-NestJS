import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { TutorsModule } from './tutors/tutors.module';

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
          from: '"NestjsCinema" <no-reply@cinema.nestjs.com>',
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
  ],
  providers: [],
})
export class AppModule {}
