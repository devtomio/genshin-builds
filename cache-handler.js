// Source: https://github.com/vercel/next.js/blob/canary/examples/cache-handler-redis/cache-handler.js
const { CacheHandler } = require("@neshca/cache-handler");
const createRedisHandler = require("@neshca/cache-handler/redis-stack").default;
const createLruHandler = require("@neshca/cache-handler/local-lru").default;
const { createClient } = require("redis");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/* from https://caching-tools.github.io/next-shared-cache/redis */
CacheHandler.onCreation(async () => {
  console.log("Creating cache handler...");
  let client;
  // use redis client during build could cause issue https://github.com/caching-tools/next-shared-cache/issues/284#issuecomment-1919145094
  if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
    const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
    try {
      // Create a Redis client.
      client = createClient({
        url: redisUrl,
      });

      // Redis won't work without error handling.
      client.on("error", (e) => {
        throw e;
      });
    } catch (error) {
      console.log(redisUrl);
      console.warn("Failed to create Redis client:", error);
    }
  }

  if (client) {
    try {
      console.info("Connecting Redis client...");

      // Wait for the client to connect.
      // Caveat: This will block the server from starting until the client is connected.
      // And there is no timeout. Make your own timeout if needed.
      await client.connect();
      console.info("Redis client connected.");
    } catch (error) {
      console.warn("Failed to connect Redis client:", error);

      console.warn("Disconnecting the Redis client...");
      // Try to disconnect the client to stop it from reconnecting.
      client
        .disconnect()
        .then(() => {
          console.info("Redis client disconnected.");
        })
        .catch(() => {
          console.warn(
            "Failed to quit the Redis client after failing to connect."
          );
        });
    }
  }

  /** @type {import("@neshca/cache-handler").Handler | null} */
  let redisHandler = null;
  if (client?.isReady) {
    // Create the `redis-stack` Handler if the client is available and connected.
    redisHandler = await createRedisHandler({
      client,
      keyPrefix: "gb:",
      timeoutMs: 1000,
    });
  }
  // Fallback to LRU handler if Redis client is not available.
  // The application will still work, but the cache will be in memory only and not shared.
  const LRUHandler = createLruHandler();
  console.warn(
    "Falling back to LRU handler because Redis client is not available."
  );

  return {
    handlers: [redisHandler, LRUHandler],
  };
});

module.exports = CacheHandler;
