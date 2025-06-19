import { createClient } from 'redis';
import { REDIS_PASSWORD, REDIS_PORT, REDIS_URL } from '../config/env.config';

export const pubClient = createClient({
  username: 'default',
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_URL!,
    port: Number(REDIS_PORT),
  },
});
export const subscriber = pubClient.duplicate();

let isConnected = false;

export const connectRedis = async () => {
  if (isConnected) return; // prevent double connection

  try {
    await pubClient.connect();
    await subscriber.connect();
    console.log('✅ Redis pub/sub connected');
    isConnected = true;
  } catch (err) {
    console.error('❌ Redis connection failed', err);
    throw err;
  }
};

export const publisher = async (data: string) => {
  if (!isConnected) {
    console.error('❌ Redis client not connected');
    return;
  }

  try {
    await pubClient.publish('notifications', data);
  } catch (err) {
    console.error('❌ Failed to publish post to Redis:', err);
  }
};
