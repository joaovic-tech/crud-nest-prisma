import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

type Exception = UserAlreadyExistsException | UserNotFoundException;

@Catch(UserAlreadyExistsException, UserNotFoundException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof UserAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
