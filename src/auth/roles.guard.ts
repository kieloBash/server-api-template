import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { IJwtPayload } from 'src/common/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as IJwtPayload;

        if (!user) {
            throw new ForbiddenException('No user found in request');
        }

        if (!requiredRoles.includes(user.role.name)) {
            throw new ForbiddenException('You do not have permission (Role mismatch)');
        }

        return true; // Role matches, allow access
    }
}
