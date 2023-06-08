import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from '../entity';

@Injectable()
export class AccountRepository {
  constructor(private dataSource: DataSource) {}

  async createAccount(account: Account): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.insert(Account, account);
      });
    } catch (err) {
      throw err;
    }
  }

  async readUserInfoById(
    id: string,
    selectOptions?: { [P in keyof Account]?: boolean },
  ): Promise<Account> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        return await manager.findOne(Account, {
          select: selectOptions,
          where: { id },
        });
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUserInfo(id: string, account: Account): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        return await manager.update(Account, { id }, account);
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        return await manager.delete(Account, { id });
      });
    } catch (err) {
      throw err;
    }
  }
}
