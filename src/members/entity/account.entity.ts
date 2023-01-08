import { Entity, PrimaryColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Role, Token } from '.';

@Entity()
export class Account {
  @PrimaryColumn({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  pw: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  address: string;

  @Column({
    name: 'cellular_phone',
    type: 'varchar',
    nullable: false,
    default: '',
  })
  cellularPhone: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: 1,
  })
  activated: boolean;

  @Column({
    name: 'create_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @ManyToMany((type) => Role, (roles) => roles._id, { cascade: true })
  roles: Role[];

  @OneToMany(() => Token, (tokens) => tokens._id, { cascade: true })
  tokens: Token[];

  static from(
    id: string,
    pw: string,
    name: string,
    address: string,
    cellularPhone: string,
  ) {
    const account = new Account();
    account.id = id;
    account.pw = pw;
    account.name = name;
    account.address = address;
    account.cellularPhone = cellularPhone;

    return account;
  }
}
