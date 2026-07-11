import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger('AuthMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[AUTH] ${req.method} ${req.originalUrl}`);
    next();
  }
}
