import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { MembersService } from 'src/members/members.service';
import { RedisService } from 'src/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private membersService: MembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['AccessToken'];

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('PRIVATEKEY'),
      });

      request['user'] = payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        const id = request.cookies['UserId'];
        const refreshToken = request.cookies['RefreshToken'];

        try {
          if (!refreshToken) {
            throw new UnauthorizedException();
          }

          const validRefreshToken = await this.redisService.get(id);

          if (!validRefreshToken || validRefreshToken !== refreshToken) {
            throw new UnauthorizedException();
          }
        } catch (err) {
          request.res.clearCookie('UserId');
          request.res.clearCookie('RefreshToken');
          request.res.clearCookie('AccessToken');

          throw err;
        }

        try {
          const userInfo = await this.membersService.getUserInfoById(id);

          const accessToken = await this.jwtService.signAsync({
            ...userInfo,
          });

          request['user'] = { ...userInfo };
          request.res.cookie('AccessToken', accessToken, { httpOnly: true });
        } catch (err) {
          throw err;
        }
      } else {
        request.res.clearCookie('UserId');
        request.res.clearCookie('RefreshToken');
        request.res.clearCookie('AccessToken');

        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
