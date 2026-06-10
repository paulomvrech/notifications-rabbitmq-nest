import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { rabbitmqOptions } from './rabbitmq.config';
import * as process from 'node:process';

async function bootstrap() {
  // 1. Cria a aplicação HTTP normal (o producer recebe requisições aqui)
  const app = await NestFactory.create(AppModule);

  // 2. "Pluga" um microservice RabbitMQ na mesma aplicação
  //    É isso que faz o @EventPattern começar a ouvir a fila
  app.connectMicroservice<MicroserviceOptions>(rabbitmqOptions);

  // 3. Inicia os listeners de microservice...
  await app.startAllMicroservices();

  // 4. ...e o servidor HTTP.
  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 API rodando em http://localhost:${process.env.PORT}`);
  console.log(`👂 Microservice ouvindo a fila "${process.env.NOTITICATION_QUEUE}"...`);
}

bootstrap();
