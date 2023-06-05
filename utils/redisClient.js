const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();



// This is redis client object which stores radisClient, help us to intrect with redis server
const redisClient = redis.createClient({
  host: 'redis-13834.c264.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 13834,
  password: 'qMoQtZEwlww9jgVLdlOWe7deRgw9vGqK',
});


redisClient.on('connect',()=> {
  console.log('Connected to Redis');
});


// Note - The promisify function is a utility in Node.js that converts callback-based functions into Promise-based functions. It allows you to work with asynchronous code in a more synchronous and structured manner using async/await syntax or .then() and .catch() chaining.

// Humne iss functions (get and set) ko promisizy kiya hai jisse apan isme async/await use kar sake
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);
const GET_ASYNC = promisify(redisClient.get).bind(redisClient);

// Get and Set are traditionaly callback based - promisify converts it into peomise based so we can use async await
// GET_ASYNC & SET_ASYNC are promise based version of get and set
module.exports = { SET_ASYNC, GET_ASYNC }