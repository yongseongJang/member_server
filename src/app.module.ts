import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [DatabaseModule, MembersModule],
})
export class AppModule {}
