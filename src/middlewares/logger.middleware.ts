import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../utils/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');

    res.on('finish', () => {
      const { statusCode } = res;

      if (statusCode >= 400) {
      	winstonLogger.error(
      	  `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      	);
      } else if (statusCode >= 200) {
      	winstonLogger.log(
      	  'info', `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      	);
      }
    });

    next();
  }
}
