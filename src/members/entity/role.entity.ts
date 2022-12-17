import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Account, Authority } from '.';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '',
  })
  authority: string;

  @ManyToMany((type) => Account, (accounts) => accounts.id, { cascade: true })
  accounts: Account[];

  @ManyToMany((type) => Authority, (authority) => authority._id, {
    cascade: true,
  })
  authorities: Authority[];
}
