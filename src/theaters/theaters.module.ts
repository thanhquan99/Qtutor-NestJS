import { Theater } from './theater.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  controllers: [TheatersController],
  providers: [TheatersService],
  exports: [TheatersService],
})
export class TheatersModule {}
