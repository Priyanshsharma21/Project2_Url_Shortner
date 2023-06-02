const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();



// This is redis client object which stores radisClient, help us to intrect with redis server
const redisClient = redis.createClient({
  host: 'redis-10006.c301.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 10006,
  password: 'G7a7d9ZeQxqwBIeUSjcwqpphKQjWCS5K',
});

redisClient.on('connect',()=> {
  console.log('Connected to Redis');
});


// Humne iss functions (get and set) ko promisizy kiya hai jisse apan isme async/await use kar sake
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);
const GET_ASYNC = promisify(redisClient.get).bind(redisClient);

module.exports = { SET_ASYNC, GET_ASYNC };