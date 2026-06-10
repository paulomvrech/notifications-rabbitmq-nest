# 📬 API de Notificações com RabbitMQ + NestJS

Demonstração de **mensageria assíncrona** usando NestJS e
`@nestjs/microservices` com transporte RabbitMQ. Uma API REST publica eventos
de notificação, consumidos por um microservice em background.

## 🏗️ Arquitetura

```
Cliente → Controller (HTTP) → ClientProxy.emit → RabbitMQ → @EventPattern → "envia e-mail"
```

## 🛠️ Tecnologias
- NestJS + TypeScript
- @nestjs/microservices (Transport.RMQ)
- RabbitMQ
- Docker / Docker Compose

## 🚀 Como rodar

```bash
docker compose up -d      # sobe o RabbitMQ
npm install
npm run start:dev         # sobe HTTP + microservice
```

## 🧪 Testando

```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{"to":"teste@email.com","subject":"Olá","body":"Teste"}'
```

Painel: http://localhost:15672 (admin / admin123)

## 📚 Conceitos demonstrados
- Producer (ClientProxy) e Consumer (@EventPattern) desacoplados
- Eventos (emit) vs Mensagens (send)
- ack/nack manual via RmqContext
- Filas duráveis e prefetch
- Reconexão automática (amqp-connection-manager)