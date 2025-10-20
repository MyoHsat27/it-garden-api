import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Admin } from '../../admins/entities';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('No user found in request');

    if (requiredRoles?.length) {
      if (!requiredRoles.includes(user.userRole)) {
        throw new ForbiddenException(
          `Access denied. Required role(s): ${requiredRoles.join(', ')}`,
        );
      }
    }

    if (
      requiredPermissions?.length &&
      user.userRole === UserRole.ADMIN &&
      user.adminProfile
    ) {
      const admin: Admin = user.adminProfile;

      const adminPermissions = admin.role?.permissions?.map(
        (p) => `${p.subject}:${p.action}`,
      );

      const missing = requiredPermissions.filter(
        (perm) => !adminPermissions?.includes(perm),
      );

      if (missing.length > 0) {
        throw new ForbiddenException(
          `Missing permission(s): ${missing.join(', ')}`,
        );
      }
    }

    return true;
  }
}
