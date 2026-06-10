import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

// Formato da mensagem que ira ser trafegada, tipagem
interface NotificationDto {
  to: string,
  subject: string,
  body: string,
}

@Controller()
export class NotificationsConsumer {

  // Simula um envio de e-mail que demora(ex: chamar um servico externo de disparo)
  private async sendEmail(notification: NotificationDto): Promise<void> {
    console.log(`✉ Enviando e-mail para ${notification.to}...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`✅ E-mail enviado: "${notification.subject}"`);
  }

  // Escuta o mesmo padrao que producer emitiu: 'notification.created'
  @EventPattern('notification.created')
  async handleNotificationCreated(
    @Payload() data: NotificationDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    // O NestJS já desserializou o JSON — 'data' já é o objeto.
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Chamando a funcao que simula o envio do e-mail
      await this.sendEmail(data);

      // ack = "processei com sucesso, pode descartar a mensagem"
      channel.ack(originalMsg);
    } catch (err) {
      console.error('Erro ao processar notificacao:', err);
      // nack com requeue: false => descarta(ou manda para uma dead-letter queue, se configurada)
      // nack com requeue: true => reenfileiraria
      channel.nack(originalMsg, false, false);
    }
  }
}