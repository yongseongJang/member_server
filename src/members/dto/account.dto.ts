import { IsString } from 'class-validator';
import { Account } from '../entity';

export class RegisterAccountDto {
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

  public setPw(pw: string) {
    this.pw = pw;
  }

  public toEntity() {
    return Account.fromRegisterAccountDto(this);
  }
}

export class DeleteAccountDto {
  @IsString()
  private pw: string;

  public getPw() {
    return this.pw;
  }
}
