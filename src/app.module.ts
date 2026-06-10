import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications/notifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_QUEUE, RABBITMQ_URL } from './rabbitmq.config';
import { NotificationsConsumer } from './notifications/notifications.consumer';

@Module({
  imports: [
    // Registra um "cliente" injetavel para publicar mensagens
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE', // token de injeção
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: NOTIFICATION_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [NotificationsController, NotificationsConsumer],
})
export class AppModule {
}
