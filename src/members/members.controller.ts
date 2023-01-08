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
} from '@nestjs/common';
import { MembersService } from './members.service';
import { RegisterAccountDto } from './dto';

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
}
