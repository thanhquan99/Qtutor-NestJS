import { ROLE } from './../constant/index';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from 'jwt-decode';
import { JwtPayload } from 'src/service/jwt/jwt-payload.interface';
import { User } from 'src/db/models';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const role = this.reflector.get<string>('role', context.getHandler());

      const request = context.switchToHttp().getRequest();
      const {
        headers: { authorization: token },
      } = request;

      if (role === undefined) {
        return true;
      }

      if (role === ROLE.OPTIONAL && !token) {
        return true;
      }

      if (role !== ROLE.OPTIONAL && !token) {
        throw new UnauthorizedException();
      }

      const { email, roleName }: JwtPayload = jwt_decode(token);

      const user = await User.query().findOne({ email }).select('id', 'email');
      request.user = { ...user, roleName };
      if (role === ROLE.OPTIONAL || roleName === ROLE.SUPER_ADMIN) {
        return true;
      }

      if (roleName === role) {
        return true;
      }

      return false;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
