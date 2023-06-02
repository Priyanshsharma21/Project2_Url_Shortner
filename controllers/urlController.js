const URLModel = require('../models/urlModel')
const validURL = require('valid-url')
const shortId = require('shortid')
const redis = require('redis')
const { promisify } = require('util')

const redisClient = redis.createClient(
    13834,
    "redis-13834.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("spLbEbcKICkYWRvSORAanAYcfrLgCOhE", function (err) {
    if (err) throw err;
});
  
redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
  
//2. Prepare the functions for each command
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// Connect to the Redis server
// const redisClient = redis.createClient({
//     port: 12032,
//     host: "redis-12032.c301.ap-south-1-1.ec2.cloud.redislabs.com",
//     password: "spLbEbcKICkYWRvSORAanAYcfrLgCOhE",
//     no_ready_check: true
//   });
  
//   redisClient.on("connect", async function () {
//     console.log("Connected to Redis..");
//   });
  
//   redisClient.on("error", function (err) {
//     console.error("Redis error:", err);
//   });
  
//   // Prepare the functions for each Redis command
//   const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
//   const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createURL = async (req , res) => {
    try {

        const { longUrl } = req.body;

        if(!longUrl){
            return res.status(400).send({
                status : false, 
                message : "Missing LongUrl"
            })
        }

        if(!validURL.isWebUri(longUrl)){
            return res.status(400).send({
                status: false,
                message: 'Invalid URL'
            })
        }

        // Check if the short URL exists in the cache
        const cachedShortUrl = await GET_ASYNC(longUrl);
        if (cachedShortUrl) {
            return res.status(200).send({
                status: true,
                message: "URL Found in Cache",
                shortUrl: cachedShortUrl
            });
        }

        const urlCode = shortId.generate();
        const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

        const data = await URLModel.create({
            urlCode,
            longUrl,
            shortUrl
        })

        // Store the short URL in the cache
        await SET_ASYNC(longUrl, shortUrl);

        res.status(201).send({
            status: true,
            message: "URL Created Successfully",
            data: data
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

const getUrl = async (req, res) => {
    try {
        const { urlCode } = req.params;

        const url = await URLModel.findOne({ urlCode });

        if(!url){
            return res.status(404).send({
                status: false,
                message: 'URL not found'
            })
        }

        return res.redirect(302, url.longUrl);

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    createURL,
    getUrl
}