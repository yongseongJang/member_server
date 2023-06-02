import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Account, Role, Authority } from './entity';
import { AccountRepository } from './repositories';
import { RedisModule } from 'src/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Role, Authority]),
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('PRIVATEKEY'),
          signOptions: { expiresIn: '1800s' },
        };
      },
    }),
  ],
  controllers: [MembersController],
  providers: [MembersService, AccountRepository],
})
export class MembersModule {}
