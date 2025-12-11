import { Injectable , Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction , Request , Response } from "express";

@Injectable()
export class authMiddleware implements NestGuard{
  private logger = new Logger('HTTP')
  use(req: Request, res: Response, next: NextFunction) {
    const {method , originalUrl} = req
    const start = Date.now()
    res.on('finish' , ()=>{
      const statusCode = res.statusCode
      const duration = Date.now() - start
          this.logger.log(`Request on ${originalUrl} with method ${method} and duration ${duration} with status code ${statusCode}`)
    })
    next()
  }
}