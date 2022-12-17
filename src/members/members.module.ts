import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Account, Role } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Role])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
