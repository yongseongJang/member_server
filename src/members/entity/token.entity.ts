import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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
    default: () => 'CURRENT_TIMESTAMP',
  })
  expireAt: string;

  @ManyToOne(() => Account)
  account: Account;
}
