import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobsService {
  @Cron('0 */3 * * * *')
  handleCron() {
    const manager = getManager();
    const compareDate = new Date(Date.now() - 1000 * 60 * 3);
    const compareDateString = compareDate.toLocaleString(undefined, {
      timeZone: 'Asia/Jakarta',
    });
    return manager.query(`
    update ticket
    set "holderId"= NULL, "holdingStartTime" = NULL, status = 'Available' 
    where "holdingStartTime" is not NULL and "holderId" is not NULL
    and "holdingStartTime" <= '${compareDateString}'`);
  }
}
