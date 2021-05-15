import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RatingsController } from './ratings.controller';
import { Rating } from './ratings.entity';
import { RatingsService } from './ratings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), AuthModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
