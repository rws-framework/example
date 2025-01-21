import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, applyDecorators, UseGuards, createParamDecorator } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import User from '../models/User';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    try {     
      const isAuthenticated = await this.authService.verifyToken(token)
      
      if (!isAuthenticated) {
        throw new UnauthorizedException();
      }

      // Add user to request object
      request.user = this.authService.getUserFromToken(token);

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard)
  );
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);