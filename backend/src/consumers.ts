import { startConsumer } from "./infrastructure/queue/consumers/emailConsumer";

// Tem que rodar em paralelo, pois é um serviço a parte
startConsumer().catch(console.error);
