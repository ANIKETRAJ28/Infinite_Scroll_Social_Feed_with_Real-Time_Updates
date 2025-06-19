import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { FRONTEND_URL, PORT } from './config/env.config';
import { router } from './routes/index.route';
import { WebSocket, WebSocketServer } from 'ws';
import { connectRedis, subscriber } from './util/redis.util';
import { IPost } from './interface/post.interface';

export type IPostSocket = {
  user_id: string;
  type: 'NEW_POST' | 'DELETE_POST';
  post: IPost;
};

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('Server is running...');
});

const server = app.listen(PORT, async () => {
  console.log('Server up! on port', PORT);
  await connectRedis();
});

export const wss = new WebSocketServer({ server });
export const clients = new Map<string, WebSocket>();

wss.on('connection', (ws, req) => {
  ws.on('error', console.error);
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const userId = params.get('userId');
  console.log(`User ${userId} connected.`);
  if (userId) {
    clients.set(userId, ws);
  }
  ws.on('close', () => {
    console.log(`User ${userId} disconnected.`);
    clients.delete(userId!);
  });
});

subscriber.subscribe('notifications', (payload) => {
  const data: IPostSocket = JSON.parse(payload);
  const ws = clients.get(data.user_id);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ post: data.post, type: data.type }));
  }
});
