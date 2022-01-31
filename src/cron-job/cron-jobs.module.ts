import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';

@Module({
  providers: [CronJobsService],
})
export class CronJobsModule {}
