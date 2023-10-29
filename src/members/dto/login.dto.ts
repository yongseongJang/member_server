import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  private id: string;

  @IsString()
  private pw: string;

  constructor(id: string, pw: string) {
    this.id = id;
    this.pw = pw;
  }

  public getId() {
    return this.id;
  }

  public getPw() {
    return this.pw;
  }
}
