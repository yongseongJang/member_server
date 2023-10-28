import { IsString } from 'class-validator';
import { Account } from '../entity';

export class RegisterOAuthDto {
  private id: string;

  private pw: string;

  @IsString()
  private name: string;

  @IsString()
  private address: string;

  @IsString()
  private cellularPhone: string;

  public getId() {
    return this.id;
  }

  public getPw() {
    return this.pw;
  }

  public getName() {
    return this.name;
  }

  public getAddress() {
    return this.address;
  }

  public getCellularPhone() {
    return this.cellularPhone;
  }

  public setId(id: string) {
    this.id = id;
  }

  public setPw(pw: string) {
    this.pw = pw;
  }

  public toEntity() {
    return Account.fromRegisterOAuthDto(this);
  }
}
