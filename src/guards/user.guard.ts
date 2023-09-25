import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import AuthorizationFailedException from '../exceptions/authorization-failed.exception';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/services/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.header('authorization')) {
      throw new AuthorizationFailedException('User not authorized.');
    }

    const token = request.header('authorization').split(' ');

    const decode: any = this.jwtService.decode(token[1]);

    if (!decode) {
      return false;
    }

    return this.check(context, request, decode);
  }

  async check(context, request, inputs) {
    const user: any = await this.userService.findById(inputs._id);

    if (!user) {
      throw new AuthorizationFailedException('User not authorized.');
    }

    request.user = user;

    return true;
  }
}
