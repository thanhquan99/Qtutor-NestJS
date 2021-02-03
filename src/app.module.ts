import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CinemasModule } from './cinemas/cinemas.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), CinemasModule],
})
export class AppModule {}
