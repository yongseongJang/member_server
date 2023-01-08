import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Account, Role, Authority, Token } from './entity';
import { AccountRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Role, Authority, Token])],
  controllers: [MembersController],
  providers: [MembersService, AccountRepository],
})
export class MembersModule {}
