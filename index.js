// require('dotenv').config();
const { createClient } = require('redis');

console.log("REDIS_URL");
console.log(process.env.REDIS_URL);
console.log(process.env.REDIS_SERVICE_NAME);
console.log(process.env.REDIS_PORT);

class for redis commands
class RedisClient {
  constructor() {
    this.isAlive = false;
    this.cl = createClient({
      host: process.env.REDIS_SERVICE_NAME, // Render Redis service name, red-xxxxxxxxxxxxxxxxxxxx
      port: process.env.REDIS_PORT || 6379, // Redis port
    });
    this.cl.connect().catch((error) => {
      console.log("connect error");
      console.log(`Redis client not connected to server: ${error}`);
    });
    this.cl.on('connect', (err) => {
      this.isAlive = true;
    });
    this.cl.on('error', (err) => {
      this.isAlive = false;
      console.log("on error");
      console.warn('Redis Client Error', err);
    });
  }

  // get value for given key
  async get(key) {
    const value = await this.cl.get(key);
    return value;
  }

  // set key value pair
  async set(key, value, time) {
    await this.cl.set(key, value, { EX: time });
  }

  // del key vale pair
  async del(key) {
    await this.cl.del(key);
  }
}

const cli = new RedisClient();
(async ()=>{
  await cli.set("test", "test passed");
  const d = await cli.get("test");
  console.log(d);
})()
