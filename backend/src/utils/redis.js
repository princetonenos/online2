import { createClient } from 'redis';
import logger from './logger.js';

let redisClient = null;

/**
 * Connect to Redis server
 */
export const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL;
  // Skip Redis in development if not explicitly configured
  if (!redisUrl || redisUrl === 'disabled' || redisUrl === 'off') {
    logger.warn('Redis disabled or REDIS_URL not provided. Skipping Redis connection.');
    return null;
  }

  try {
    redisClient = createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('ready', () => {
      logger.info('✅ Redis client ready');
    });

    redisClient.on('end', () => {
      logger.info('❌ Redis connection closed');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Don't fail the app if Redis is unavailable
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = () => {
  return redisClient;
};

/**
 * Set value in Redis with optional expiration
 */
export const setCache = async (key, value, expirationInSeconds = 3600) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      logger.warn('Redis client not available');
      return false;
    }
    
    const serializedValue = JSON.stringify(value);
    await redisClient.setEx(key, expirationInSeconds, serializedValue);
    return true;
  } catch (error) {
    logger.error(`Failed to set cache for key ${key}:`, error);
    return false;
  }
};

/**
 * Get value from Redis
 */
export const getCache = async (key) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      logger.warn('Redis client not available');
      return null;
    }
    
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Failed to get cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete value from Redis
 */
export const deleteCache = async (key) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Failed to delete cache for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 */
export const deleteCachePattern = async (pattern) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Failed to delete cache pattern ${pattern}:`, error);
    return false;
  }
};

/**
 * Check if key exists
 */
export const cacheExists = async (key) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Failed to check cache existence for key ${key}:`, error);
    return false;
  }
};

/**
 * Close Redis connection
 */
export const disconnectRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};

export default {
  connectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  cacheExists,
  disconnectRedis,
};
