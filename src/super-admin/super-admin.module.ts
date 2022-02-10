import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../service/jwt/jwt.strategy';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Q-tutor',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, JwtStrategy],
})
export class SuperAdminModule {}
