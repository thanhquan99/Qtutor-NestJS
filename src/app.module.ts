import { ShowtimesModule } from './showtimes/showtimes.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ActorsModule } from './actors/actors.module';
import { DirectorsModule } from './directors/directors.module';
import { GenresModule } from './genres/genres.module';
import { RolesModule } from './roles/roles.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AppConfigModule } from './app-config/app-config.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import * as connectionOptions from './ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permissions.guard';
import { SeatsModule } from './seats/seats.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { RoomsModule } from './rooms/rooms.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketTypesModule } from './ticket-types/ticket-types.module';
import { RatingsModule } from './ratings/ratings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';

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
    TypeOrmModule.forRoot(connectionOptions),
    CinemasModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    ActorsModule,
    DirectorsModule,
    GenresModule,
    RolesModule,
    UserRoleModule,
    AppConfigModule,
    PermissionsModule,
    RolePermissionModule,
    SeatsModule,
    RoomsModule,
    ShowtimesModule,
    TicketsModule,
    TicketTypesModule,
    RatingsModule,
    TransactionsModule,
    CronJobsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
