import { Logger , ExceptionFilter , HttpException , Catch  , ArgumentsHost } from "@nestjs/common";


export class globalFiler implements ExceptionFilter{
  private readonly logger = new Logger(globalFiler.name)
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error'
    this.logger.log('Exception error' , exception instanceof Error ? exception.stack:'')
    response.status(status).json({
      statusCode : status,
      message,
      timestamp: new Date().toISOString()
    })
  }
}