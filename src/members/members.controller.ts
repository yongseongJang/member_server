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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MembersService } from './members.service';
import { RegisterAccountDto, DeleteAccountDto, LoginDto } from './dto';
import { AuthGuard } from '../guards/auth.guard';

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
      const { id, refreshToken, accessToken } = await this.membersService.login(
        loginDto,
      );

      res.cookie('UserId', id, {
        httpOnly: true,
      });
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

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      await this.membersService.logout(req['user'].id);

      res.clearCookie('UserId');
      res.clearCookie('RefreshToken');
      res.clearCookie('AccessToken');

      return res.status(HttpStatus.OK).send();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'fail to logout',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    try {
      await this.membersService.deleteAccount(
        req['user'].id,
        deleteAccountDto.getPw(),
      );

      res.clearCookie('UserId');
      res.clearCookie('RefreshToken');
      res.clearCookie('AccessToken');

      return res.status(HttpStatus.OK).send();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'fail to delete account',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
