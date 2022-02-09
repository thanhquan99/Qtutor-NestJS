import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../service/jwt/jwt.strategy';
import { SAAuthController } from './SAAuth.controller';
import { SAAuthService } from './SAAuth.service';

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
  controllers: [SAAuthController],
  providers: [SAAuthService, JwtStrategy],
})
export class SAAuthModule {}
