import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories';
import { LoginDto, RegisterAccountDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { Account } from './entity';
import { RedisService } from 'src/redis.service';

@Injectable()
export class MembersService {
  constructor(
    private accountRepository: AccountRepository,
    private redisService: RedisService,
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

  async login(
    loginDto: LoginDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    try {
      const userInfo: Account | null =
        await this.accountRepository.readUserInfoById(loginDto.getId(), {
          pw: true,
        });

      if (!userInfo) {
        throw new Error('Invalid Id');
      }

      await this.comparePasswordToHash(loginDto.getPw(), userInfo.pw);

      const accessToken = await this.getToken(loginDto.getId());
      const refreshToken = v4();
      await this.redisService.set(
        loginDto.getId(),
        refreshToken,
        14 * 24 * 60 * 60,
      );

      return { refreshToken, accessToken };
    } catch (err) {
      console.log(err);
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

  private getToken(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.PRIVATEKEY || 'privatekey',
        {
          expiresIn: 1800000,
        },
        (err: null | Error, token: string | undefined) => {
          if (err) {
            reject(new Error('fail to make token'));
          } else {
            resolve(token);
          }
        },
      );
    });
  }
}
