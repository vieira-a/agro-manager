import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from './domain.exeption';
import { Logger } from 'nestjs-pino';
import { ApplicationException } from './application.exeption';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let exceptionDetails: { name: string; message: string } = {
      name: 'UnknownException',
      message: 'Internal server error',
    };

    let exceptionParams: Record<string, unknown> = {};

    if (
      exception instanceof DomainException ||
      exception instanceof ApplicationException
    ) {
      status = exception.statusCode;
      exceptionDetails = {
        name: exception.name,
        message: exception.message,
      };

      exceptionParams = exception.params || {};
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      exceptionDetails = {
        name: exception.name,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as { message: string }).message
          : exception.message;

      exceptionDetails = {
        name: exception.name,
        message,
      };
    }

    this.logger.error(
      {
        exception,
        params: exceptionParams,
        path: request.url,
        method: request.method,
      },
      `Exception caught: ${exceptionDetails.name} - ${exceptionDetails.message}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      exception: exceptionDetails,
      params: exceptionParams,
    });
  }
}
