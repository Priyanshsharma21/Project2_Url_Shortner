# Scalable URL Shortner Project Requirement

## Phase I

## Overview
URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs.

For example, if we shorten the following URL through TinyURL:

```
https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143
```

We would get:

```
https://tinyurl.com/y4ned4ep
```

The shortened URL is nearly one-fifth the size of the actual URL.

Some of the use cases for URL shortening is to optimise links shared across users, easy tracking of individual links and sometimes hiding the affiliated original URLs.

If you haven’t used tinyurl.com before, please try creating a new shortened URL and spend some time going through the various options their service offers. This will help you have a little context to the problem we solve through this project.

### Key points
- Create a group database `groupXDatabase`. You can clean the db you previously used and reuse that.
- This time each group should have a *single git branch*. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention `project/urlShortnerGroupX`
- Follow the naming conventions exactly as instructed. The backend code will be integrated with the front-end application which means any mismatch in the expected request body will lead to failure in successful integration.

### Models
- Url Model
```
{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
```

### POST /url/shorten
- Create a short URL for an original url recieved in the request body.
- The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
- Return the shortened unique url. Refer [this](#url-shorten-response) for the response
- Ensure the same response is returned for an original url everytime
- Return HTTP status 400 for an invalid request

### GET /:urlCode
- Redirect to the original URL corresponding
- Use a valid HTTP status code meant for a redirection scenario.
- Return a suitable error for a url not found
- Return HTTP status 400 for an invalid request

## Testing 
- To test these apis create a new collection in Postman named Project 2 Url Shortner
- Each api should have a new request in this collection
- Each request in the collection should be rightly named. Eg  Url shorten, Get Url etc
- Each member of each team should have their tests in running state

## Phase II

```diff
+Consider that Twitter has this trend where a famous person with a wide following when posts a link, the link gets frequented in millions within a day.

+So in our application we would want to implement caching so that a newly created link is cached for 24 hours. When a person uses a short url, the long url should be retrieved from cache in the first 24 hours of that url being created.

+- Use caching while fetching the shortened url to minimize db calls.
+- Implement what makes sense to you and we will build understanding over the assessment of this project. You should understand and should be able to explain the logic that you have implemented.
```

## Response

### Successful Response structure
```yaml
{
  status: true,
  data: {

  }
}
```
### Error Response structure
```yaml
{
  status: false,
  message: ""
}
```
## Response samples

### Url shorten response
```yaml
{
  status: true,
  "data": {
    "longUrl": "http://www.abc.com/oneofthelongesturlseverseenbyhumans.com",
    "shortUrl": "http://localhost:3000/ghfgfg",
    "urlCode": "ghfgfg"
  } 
}

```



#Termnologies used - 


## 1. Caching
Caching is a technique used to store frequently accessed and computational expensive data in a cache, which is a temporary storage location. The purpose of caching is to improve the performance and efficiency of an application by reducing the time and resources required to fetch data from the original data source(database). When a requested data is found in the cache, it can be retrieved much faster, avoiding the need to retrieve it from the original source.



Caching can be implemented at various levels, such as database-level caching, application-level caching, or even on the client-side. 



## 1. Redis
Redis (Remote Dictionary Server) is an open-source, in-memory data structure store. It is often used as a cache, database, or message broker. Redis supports various data structures such as strings, hashes, lists, sets, and more, providing flexibility for different use cases.

# 1. Redis is used to store data in cache - Redis allow us to perform caching, which saves time and resources and hence fast read write operations

Advantages - 
exceptional performance
scalability
capable of handling millions of operations per second.
Replication and clustering for high availability 
fault tolerance.


# working with redis for caching.
1. Make connection with redis server
1.1 Make connection with redis server using rediscreateClient. - pass PORT, Host string and Password
1.2 redis.createClient create redis client instance
1.3 Host is IP of redis server
1.4 Port is port number on which redis client is listening
1.5 password is used for authentication and is option field

2. Get and Set functions 
  
  const SET_ASYNC = promisify(redisClient.set).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.get).bind(redisClient);

This code  promisify function from the built-in util module in Node.js to convert Redis client methods into Promise-based functions. 
This allows you to use asynchronous programming patterns, such as async/await or .then()/.catch(), when working with Redis operations.

2.1 redisClient is an instance of a Redis client that has been previously created and connected to a Redis server.
2.2 redisClient.set is a method provided by the Redis client for setting a value in the Redis database. It is typically used to store key-value pairs.
2.3 redisClient.get is a method provided by the Redis client for retrieving a value from the Redis database based on a given key.

2.4 bind(redisClient) is used to bind the Redis client instance to the converted Promise-based functions (SET_ASYNC and GET_ASYNC). This ensures that the functions are called in the context of the Redis client, allowing them to access the appropriate Redis connection.