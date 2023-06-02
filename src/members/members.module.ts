import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Account, Role, Authority } from './entity';
import { AccountRepository } from './repositories';
import { RedisModule } from 'src/redis.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Role, Authority]),
    RedisModule,
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MembersService, AccountRepository],
})
export class MembersModule {}
