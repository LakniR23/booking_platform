import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ServicesMiddleware implements NestMiddleware {
  private logger = new Logger('ServicesMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[SERVICES] ${req.method} ${req.originalUrl}`);
    next();
  }
}
