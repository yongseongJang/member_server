import { IsString } from 'class-validator';
import { Account } from '../entity';

export class UserInfoDto {
  @IsString()
  private id: string;

  @IsString()
  private pw: string;

  @IsString()
  private name: string;

  @IsString()
  private address: string;

  @IsString()
  private cellularPhone: string;

  constructor(
    id: string,
    name: string,
    address: string,
    cellularPhone: string,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.cellularPhone = cellularPhone;
  }

  static from(userInfo: Account) {
    const userInfoDto = new UserInfoDto(
      userInfo.id,
      userInfo.name,
      userInfo.address,
      userInfo.cellularPhone,
    );

    return userInfoDto;
  }
}

export class UpdateUserInfoDto {
  @IsString()
  private pw: string;

  @IsString()
  private address: string;

  @IsString()
  private cellularPhone: string;

  public getPw() {
    return this.pw;
  }

  public getAddress() {
    return this.address;
  }

  public getCellularPhone() {
    return this.cellularPhone;
  }

  public toEntity() {
    return Account.fromUpdateUserInfoDto(this);
  }
}
