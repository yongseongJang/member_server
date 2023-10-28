import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories';
import {
  LoginDto,
  RegisterAccountDto,
  UpdateUserInfoDto,
  RegisterOAuthDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Account } from './entity';
import { RedisService } from 'src/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MembersService {
  constructor(
    private accountRepository: AccountRepository,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  async registerAccount(registerAccountDto: RegisterAccountDto): Promise<void> {
    try {
      await this.checkIdDuplication(registerAccountDto.getId());

      registerAccountDto.setPw(
        await this.hashPassword(registerAccountDto.getPw()),
      );

      await this.accountRepository.createAccount(registerAccountDto.toEntity());
    } catch (err) {
      throw err;
    }
  }

  async registerOAuthAccount(registerOAuthDto: RegisterOAuthDto): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    try {
      const id = registerOAuthDto.getId();
      await this.checkIdDuplication(id);

      registerOAuthDto.setPw(await this.hashPassword(id));

      await this.accountRepository.createAccount(registerOAuthDto.toEntity());

      const accessToken = await this.jwtService.signAsync({
        id,
      });
      const refreshToken = v4();
      await this.redisService.set(id, refreshToken, 14 * 24 * 60 * 60);

      return { refreshToken, accessToken };
    } catch (err) {
      throw err;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ id: string; refreshToken: string; accessToken: string }> {
    try {
      const userInfo = await this.getUserInfoById(loginDto.getId());

      await this.comparePasswordToHash(loginDto.getPw(), userInfo.pw);

      const accessToken = await this.jwtService.signAsync({ ...userInfo });
      const refreshToken = v4();
      await this.redisService.set(
        loginDto.getId(),
        refreshToken,
        14 * 24 * 60 * 60,
      );

      return { id: userInfo.id, refreshToken, accessToken };
    } catch (err) {
      throw err;
    }
  }

  async logout(id: string): Promise<void> {
    try {
      await this.redisService.del(id);
    } catch (err) {
      throw err;
    }
  }

  async updateUserInfo(id: string, updateUserInfoDto: UpdateUserInfoDto) {
    try {
      const userInfo = await this.getUserInfoById(id);

      await this.comparePasswordToHash(updateUserInfoDto.getPw(), userInfo.pw);

      await this.accountRepository.updateUserInfo(
        id,
        updateUserInfoDto.toEntity(),
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteAccount(id: string, pw: string): Promise<void> {
    try {
      await this.redisService.del(id);

      const userInfo = await this.getUserInfoById(id);

      await this.comparePasswordToHash(pw, userInfo.pw);

      await this.accountRepository.deleteAccount(id);
    } catch (err) {
      throw err;
    }
  }

  async getUserInfoById(id: string): Promise<Account> {
    try {
      const userInfo: Account | null =
        await this.accountRepository.readUserInfoById(id);

      if (!userInfo) {
        throw new Error('Invalid Id');
      }

      return userInfo;
    } catch (err) {
      throw err;
    }
  }

  private async checkIdDuplication(id: string): Promise<void> {
    try {
      const accountInfo = await this.accountRepository.readUserInfoById(id);

      if (accountInfo) {
        throw new Error('Id Duplication');
      }
    } catch (err) {
      throw err;
    }
  }

  private async hashPassword(pw: string): Promise<string> {
    return bcrypt
      .hash(pw, 10)
      .then((hash: string) => {
        return hash;
      })
      .catch((err) => {
        throw err;
      });
  }

  private comparePasswordToHash(pw: string, hash: string) {
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(pw, hash)
        .then((res: boolean) => {
          if (res) {
            resolve(res);
          } else {
            reject(new Error('Invalid Password'));
          }
        })
        .catch((err) => {
          reject(new Error(err.message));
        });
    });
  }
}
