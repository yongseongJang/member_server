import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/members/entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(userInfo: Account) {
    const payload = { ...userInfo };
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }
}
