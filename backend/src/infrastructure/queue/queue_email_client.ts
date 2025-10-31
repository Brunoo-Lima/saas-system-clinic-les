import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null, // necessário para BullMQ
  enableReadyCheck: false,    // evita travar em conexões lentas
});
export const queueClient = new Queue("welcome_email", { connection })
export const queueScheduling = new Queue("scheduling_email", { connection })
export const queuePasswordReset = new Queue("password_reset_email", { connection })
export const queueNewScheduling = new Queue("new_scheduling_email", { connection })
export const queueCanceledScheduling = new Queue("canceled_scheduling_email", { connection })