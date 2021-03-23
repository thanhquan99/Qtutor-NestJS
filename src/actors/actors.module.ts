import { AuthModule } from './../auth/auth.module';
import { Actor } from './actor.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), AuthModule],
  controllers: [ActorsController],
  providers: [ActorsService],
})
export class ActorsModule {}
