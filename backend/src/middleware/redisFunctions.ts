import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const setKey = async (key: string, value: string, expiry?: number): Promise<void> => {
  if (expiry) {
    await redis.set(key, value, "EX", expiry);
  } else {
    await redis.set(key, value);
  }
};

export const getKey = async (key: string): Promise<string | null> => {
  return await redis.get(key);
};

export const deleteKey = async (key: string): Promise<number> => {
  return await redis.del(key);
};

export const setJSON = async (key: string, value: object, expiry?: number): Promise<void> => {
  const jsonString = JSON.stringify(value);
  await setKey(key, jsonString, expiry);
};

export const getJSON = async <T>(key: string): Promise<T | null> => {
  const value = await getKey(key);
  return value ? JSON.parse(value) : null;
};

export const incrementKey = async (key: string, amount: number = 1): Promise<number> => {
  return await redis.incrby(key, amount);
};

export const existsKey = async (key: string): Promise<boolean> => {
  return (await redis.exists(key)) === 1;
};

export default redis;
