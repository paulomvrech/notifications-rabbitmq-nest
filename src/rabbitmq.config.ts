import * as process from 'node:process';
import { RmqOptions, Transport } from '@nestjs/microservices';

export const RABBITMQ_URL = process.env.RABBITMQ_URL ?? '';
export const NOTIFICATION_QUEUE = process.env.NOTITICATION_QUEUE;

// Opcoes reutilizadas pelo producer(client) e pelo consumer(microservice)
export const rabbitmqOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [RABBITMQ_URL],
    queue: NOTIFICATION_QUEUE,
    queueOptions: {
      durable: true, // durable: true => a fila sobrevive a reinicios do RabbitMQ
    },
    // noAck: false => ack manual. Com EventPattern, o NestJS pode dar ack automático ao final do handler.
    noAck: false,
    // Distribui a carga de forma justa entre multiplos workers
    // prefetch(1) => "só me entregue 1 mensagem por vez, só me de a proxima depois que eu confirmar(ack) a atual"
    prefetchCount: 1,
  },
};