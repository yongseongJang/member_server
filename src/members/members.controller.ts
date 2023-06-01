import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MembersService } from './members.service';
import { RegisterAccountDto, LoginDto } from './dto';

@Controller('/api/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Post()
  async registerAccount(@Body() registerAccountDto: RegisterAccountDto) {
    try {
      await this.membersService.registerAccount(registerAccountDto);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to register account',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { refreshToken, accessToken } = await this.membersService.login(
        loginDto,
      );

      res.cookie('RefreshToken', refreshToken, {
        httpOnly: true,
      });
      res.cookie('AccessToken', accessToken, {
        httpOnly: true,
      });

      return res.status(HttpStatus.OK).send();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to login',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
