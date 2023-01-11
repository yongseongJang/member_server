import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { MembersModule } from './members/members.module';

import * as path from 'path';
import { LoggerMiddleware } from './middlewares';

const envFileName =
  process.env.NODE_ENV === 'production'
    ? '.env'
    : process.env.NODE_ENV === 'development'
    ? '.env.dev'
    : '.env.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, `../${envFileName}`),
    }),
    DatabaseModule,
    MembersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
