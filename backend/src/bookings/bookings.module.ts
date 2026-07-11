import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsMiddleware } from './bookings.middleware';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BookingsMiddleware).forRoutes(BookingsController);
  }
}
