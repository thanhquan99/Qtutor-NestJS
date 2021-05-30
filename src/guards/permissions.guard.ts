import { User } from './../users/user.entity';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from 'jwt-decode';
import { getManager } from 'typeorm';
import { RolePermissionView } from 'src/role-permission/role-permission-view.entity';
import { JwtPayload } from 'src/service/jwt/jwt-payload.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const {
      headers: { authorization: token },
    } = request;

    if (permissions === undefined) {
      return true;
    }
    if (!token) {
      throw new UnauthorizedException();
    }

    let user: JwtPayload;
    try {
      user = jwt_decode(token);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const currentUser = await User.findOne({ where: { email: user.email } });
    delete currentUser.password;
    delete currentUser.salt;
    if (!currentUser.isActive) {
      throw new UnauthorizedException(
        'Your account is not active. Please verify your email',
      );
    }
    request.user = currentUser;

    if (!permissions || permissions[0] === '') {
      return true;
    }
    const { roleName } = user;

    const manager = getManager();
    const rolePermission = await manager
      .createQueryBuilder(RolePermissionView, 'role_permission_view')
      .where(
        '"role_permission_view"."roleName" = :roleName AND :permission = ANY("permissionActions")',
        {
          roleName,
          permission: permissions[0],
        },
      )
      .select()
      .getOne();

    if (rolePermission) {
      return true;
    }
    return false;
  }
}
