import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TodoModule,
  ],
  exports: [JwtModule],
})
export class AppModule {}
