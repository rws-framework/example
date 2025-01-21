import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Keep the original URL but serve the static 404.html page
    response.sendFile(
      path.join(process.cwd(), process.env.PUBLIC_DIR, '404.html'),
      (err) => {
        if (err) {
          response.sendFile(
            path.join(process.cwd(), '..', 'frontend','public', 'index.html')
          );
        }
      }
    );
  }
}