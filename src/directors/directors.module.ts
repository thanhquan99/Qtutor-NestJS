import { AuthModule } from './../auth/auth.module';
import { Director } from './director.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DirectorsController } from './directors.controller';
import { DirectorsService } from './directors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), AuthModule],
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}
