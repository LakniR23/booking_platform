import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesMiddleware } from './services.middleware';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ServicesMiddleware).forRoutes(ServicesController);
  }
}
