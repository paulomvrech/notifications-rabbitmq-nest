import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Formato da mensagem que ira ser trafegada, tipagem
interface NotificationDto {
  to: string,
  subject: string,
  body: string,
}

@Controller('notifications')
export class NotificationsController {
  // O NestJS injeta o cliente que foi registrado no AppModule
  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly client: ClientProxy,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED) // 202: aceito, processarei depois
  async create(@Body() notificationDto: NotificationDto) {
    if (!notificationDto.to || !notificationDto.subject || !notificationDto.body) {
      throw new BadRequestException('Campos obrigatórios: to, subject, body');
    }

    // emit() publica um EVENTO (fire-and-forget): "isto aconteceu"
    // 'notification.created' é o padrão (pattern) que o consumer vai escutar
    this.client.emit('notification.created', notificationDto);

    return {message: `📤 Notificação enfileirada para: ${notificationDto.to}`}
  }
}
