import 'dotenv/config';
import amqplib from "amqplib";
import EmailService from '../../Mail/EmailService/email.service'

export async function startConsumer() {
  const connection = await amqplib.connect(process.env.AMQP_URL as string);
  const channel = await connection.createChannel();
  const queue = "dispatch_email"; // nome da fila

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const user = JSON.parse(msg.content.toString());
      await EmailService.sendMail(user);
      
      // Após o processaamento, ele remove da fila, informando para o Rabbit que já foi processado
      channel.ack(msg);
    }
  });
}

