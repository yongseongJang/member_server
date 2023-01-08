import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('TYPEORM_HOST'),
          port: parseInt(configService.get('TYPEORM_PORT')),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          database: configService.get('TYPEORM_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
