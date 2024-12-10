import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { HeaderMiddleware, BasicAuthMiddleware } from './middleware/header.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Config tersedia di seluruh aplikasi
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderMiddleware).forRoutes('*');
    consumer.apply(BasicAuthMiddleware).forRoutes('*');
    // consumer.apply(ApiKeyMiddleware).forRoutes(UserController); // Untuk controller tertentu
  }
}
