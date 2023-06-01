import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '.';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: false,
    default: '',
  })
  refreshToken: string;

  @Column({
    name: 'expired_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'DATE_ADD(NOW(), INTERVAL 14 DAY)',
  })
  expireAt: string;

  @Column({
    name: 'account_id',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '',
  })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'account_id',
    referencedColumnName: 'id',
  })
  account: Account;

  static from(refreshToken: string, accountId: string) {
    const token = new Token();
    token.refreshToken = refreshToken;
    token.accountId = accountId;

    return token;
  }
}
