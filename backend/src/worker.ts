import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import EmailService from "./infrastructure/Mail/EmailService/email.service";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  "welcome_email",
  async (job) => {
    const data = job.data;

    await EmailService.sendMail(data);

    console.log(`✅ E-mail enviado para: ${data.email}`);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error(`❌ Falha ao enviar e-mail (Job ${job?.id}):`, err);
});

console.log("👷 Worker de e-mail rodando...");
