import { Controller, Get, Post, Put, Patch, Delete } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('/members')
export class MembersController {
  constructor(private membersService: MembersService) {}
}
