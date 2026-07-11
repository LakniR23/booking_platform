import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BookingsMiddleware implements NestMiddleware {
  private logger = new Logger('BookingsMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[BOOKINGS] ${req.method} ${req.originalUrl}`);
    next();
  }
}
