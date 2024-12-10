import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { HeaderMiddleware, BasicAuthMiddleware } from './middleware/header.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Config tersedia di seluruh aplikasi
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    PassportModule,
    MasterModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' }, // Token berlaku selama 1 jam
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderMiddleware).forRoutes('*');
    consumer.apply(BasicAuthMiddleware).forRoutes({ path: 'v1/specific-route', method: RequestMethod.GET });
    //consumer.apply(BasicAuthMiddleware).forRoutes('*');
    // consumer.apply(ApiKeyMiddleware).forRoutes(UserController); // Untuk controller tertentu
  }
}
