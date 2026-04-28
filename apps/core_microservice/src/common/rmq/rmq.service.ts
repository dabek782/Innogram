import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { EXCHANGES, QUEUES } from '../events/event.constants';
@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(serviceName, noAck = false): RmqOptions {
    const exchangeName = EXCHANGES.EVENTS;
    if (!exchangeName) {
      throw new Error(
        'EVENTS_EXCHANGE is not defined in the environment variables'
      );
    }

    const notificationQueue = this.configService.get<string>(
      'NOTIFICATION_EVENTS_QUEUE'
    );
    if (!notificationQueue) {
      throw new Error(
        'NOTIFICATION_EVENTS_QUEUE is not defined in the environment variables'
      );
    }
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URL') || ''],
        persistent: true,
        noAck,
        exchange: exchangeName,
        exchangeType: 'topic',
        queue: notificationQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
