import { Entity, PrimaryColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Role } from '.';
import { RegisterAccountDto, UpdateUserInfoDto } from '../dto';

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

  static fromRegisterAccountDto(registerAccountDto: RegisterAccountDto) {
    const account = new Account();
    account.id = registerAccountDto.getId();
    account.pw = registerAccountDto.getPw();
    account.name = registerAccountDto.getName();
    account.address = registerAccountDto.getAddress();
    account.cellularPhone = registerAccountDto.getCellularPhone();

    return account;
  }

  static fromUpdateUserInfoDto(updateUserInfoDto: UpdateUserInfoDto) {
    const account = new Account();
    account.address = updateUserInfoDto.getAddress();
    account.cellularPhone = updateUserInfoDto.getCellularPhone();

    return account;
  }
}
