import 'dotenv/config';
import amqplib from "amqplib";

class Queue {
    private connection: any
    private channel:any
    private queue: string
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queue = "dispatch_email";
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqplib.connect(process.env.AMQP_URL as string);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queue, { durable: true });
        }
    }

    async publish(message: any) {
        await this.connect();
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
}

export default new Queue();
