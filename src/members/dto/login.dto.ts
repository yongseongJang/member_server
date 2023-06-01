import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  private id: string;

  @IsString()
  private pw: string;

  public getId() {
    return this.id;
  }

  public getPw() {
    return this.pw;
  }
}
