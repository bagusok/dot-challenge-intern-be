import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

type HttpExceptionResponseBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    const normalized = this.normalizeExceptionResponse(exceptionResponse);

    response.status(status).json({
      success: false,
      error: normalized.error ?? '',
      message: normalized.message,
    });
  }

  private normalizeExceptionResponse(
    response: string | object,
  ): HttpExceptionResponseBody {
    if (typeof response === 'string') {
      return {
        message: response,
        error: '',
      };
    }

    const maybeResponse = response as HttpExceptionResponseBody;

    return {
      message: maybeResponse.message ?? 'Unexpected error',
      error: maybeResponse.error ?? '',
    };
  }
}
