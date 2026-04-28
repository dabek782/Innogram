import { EXCHANGES } from './event.constants';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EventPublisherService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly client: ClientProxy,
    @Inject('config') private readonly configService: ConfigService
  ) {}
  onModuleInit() {
    this.client.connect();
  }
  onModuleDestroy() {
    this.client.close();
  }
}
