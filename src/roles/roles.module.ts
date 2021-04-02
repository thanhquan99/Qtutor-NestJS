import { AuthModule } from './../auth/auth.module';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
