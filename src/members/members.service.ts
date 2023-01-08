import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories';
import { RegisterAccountDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private accountRepository: AccountRepository) {}

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
}
