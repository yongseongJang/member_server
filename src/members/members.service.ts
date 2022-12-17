import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Role } from './entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
}
