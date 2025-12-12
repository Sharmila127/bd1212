import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "redis";
import amqp from "amqplib";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = process.env.JWT_SECRET || "mysecret";

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
redisClient.connect().then(() => console.log("Connected to Redis"));

let channel;
async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
  channel = await connection.createChannel();
  await channel.assertQueue('auth-queue');
  console.log("Connected to RabbitMQ");
}
connectRabbitMQ();

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  await redisClient.set(`token:${email}`, token, { EX: 3600 });

  if (channel) channel.sendToQueue('auth-queue', Buffer.from(JSON.stringify({ email, action: 'login' })));

  res.json({ token });
});

app.listen(3001, () => console.log("Auth service running on 3001"));
