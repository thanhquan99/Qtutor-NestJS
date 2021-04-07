import { AuthModule } from './../auth/auth.module';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule],
})
export class UsersModule {}
