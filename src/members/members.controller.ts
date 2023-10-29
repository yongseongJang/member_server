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
import {
  RegisterAccountDto,
  DeleteAccountDto,
  LoginDto,
  UserInfoDto,
  UpdateUserInfoDto,
  RegisterOAuthDto,
} from './dto';
import { AuthGuard } from '../guards/auth.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Controller('/api/members')
export class MembersController {
  constructor(
    private membersService: MembersService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const userInfo = await this.membersService.getUserInfoById(
        req['user'].id,
      );

      return res.status(HttpStatus.OK).send(UserInfoDto.from(userInfo));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to get user info',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async registerAccount(
    @Res() res: Response,
    @Body() registerAccountDto: RegisterAccountDto,
  ) {
    try {
      await this.membersService.registerAccount(registerAccountDto);

      return res.status(HttpStatus.OK).send();
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
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
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

  @Get('/naver-oauth')
  async naverOAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const api_url =
        'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
        this.configService.get('OAUTH_NAVER_CLIENT_ID') +
        '&redirect_uri=' +
        encodeURI(this.configService.get('OAUTH_REDIRECT_URI')) +
        '&state=' +
        encodeURI(this.configService.get('OAUTH_NAVER_STATE'));

      return res.status(HttpStatus.OK).send({ api_url });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to naver social login',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/naver-issue')
  async naverIssue(@Req() req: Request, @Res() res: Response) {
    try {
      const client_id = this.configService.get('OAUTH_NAVER_CLIENT_ID');
      const client_secret = this.configService.get('OAUTH_NAVER_CLIENT_SECRET');

      const api_url =
        'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
        client_id +
        '&client_secret=' +
        client_secret +
        '&code=' +
        req.query.code +
        '&state=' +
        req.query.state;

      const options = {
        headers: {
          'X-Naver-Client-Id': client_id,
          'X-Naver-Client-Secret': client_secret,
        },
      };

      const tokenInfo = await this.httpService
        .get(api_url, options)
        .toPromise();

      if (tokenInfo.data.error) {
        return res.status(tokenInfo.data.error).send();
      }

      res.cookie('Naver_RefreshToken', tokenInfo.data.refresh_token, {
        httpOnly: true,
      });
      res.cookie('Naver_AccessToken', tokenInfo.data.access_token, {
        httpOnly: true,
      });

      const option = {
        headers: {
          Authorization: 'Bearer ' + tokenInfo.data.access_token,
        },
      };

      const userInfo = await this.httpService
        .get('https://openapi.naver.com/v1/nid/me', option)
        .toPromise();

      if (userInfo.data.error) {
        return res.status(userInfo.data.error).send();
      }

      try {
        const { id, refreshToken, accessToken } =
          await this.membersService.login(
            new LoginDto(userInfo.data.response.id, userInfo.data.response.id),
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
            status: HttpStatus.MOVED_PERMANENTLY,
            error: 'register user info',
          },
          HttpStatus.MOVED_PERMANENTLY,
        );
      }
    } catch (err) {
      if (err.status === 301) {
        throw err;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to issue token',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/naver-register')
  async naverRegister(
    @Req() req: Request,
    @Body() registerOAuthDto: RegisterOAuthDto,
    @Res() res: Response,
  ) {
    try {
      const option = {
        headers: {
          Authorization: 'Bearer ' + req.cookies['Naver_AccessToken'],
        },
      };

      const response = await this.httpService
        .get('https://openapi.naver.com/v1/nid/me', option)
        .toPromise();

      if (response.data.error) {
        return res.status(response.data.error).send();
      }

      const id = response.data.response.id;
      registerOAuthDto.setId(id);
      const { refreshToken, accessToken } =
        await this.membersService.registerOAuthAccount(registerOAuthDto);

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
          error: 'fail to register oauth account',
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
  @Patch()
  async updateUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    try {
      await this.membersService.updateUserInfo(
        req['user'].id,
        updateUserInfoDto,
      );

      return res.status(HttpStatus.OK).send();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'fail to update user info',
        },
        HttpStatus.BAD_REQUEST,
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
