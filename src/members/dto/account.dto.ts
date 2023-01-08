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

  public setPw(pw: string) {
    this.pw = pw;
  }

  public toEntity() {
    return Account.from(
      this.id,
      this.pw,
      this.name,
      this.address,
      this.cellularPhone,
    );
  }
}
