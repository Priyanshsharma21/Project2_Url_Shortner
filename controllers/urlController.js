const URLModel = require('../models/urlModel')
const validURL = require('valid-url')
const shortId = require('shortid')
const { long } = require('webidl-conversions')
require('dotenv').config()

const { BASE_URL} = process.env

//1 connecting redis 

const redisClient = redis.createClient(13834 ,'redis-13834.c264.ap-south-1-1.ec2.cloud.redislabs.com:13834' , {no_ready_check : true})

redisClient.auth('qMoQtZEwlww9jgVLdlOWe7deRgw9vGqK',function(err){
    if(err)  throw err
})

redisClient.on('connect', async function(){
    console.log("Redis is connected")
})

//2. Prepare the function for each command

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)

const createURL = async (req , res) => {
    try {const {longUrl} = req.body

    if(!longUrl) {
        return res.status(400).send({status : false , message : "Missing longUrl"})
    }

    if(!validURL.isUri(longUrl)) {
        return res.status(400).send({status : false , message : "Invalid longUrl"})
    }

    const urlCode = shortId.generate()

    const shortUrl = `http://localhost:3000/${urlCode}`

    const data = await URLModel.create({
        urlCode ,
        longUrl ,
        shortUrl
    })
    res.status(201).send({
        status : true , 
        data : data 
    })
} catch (error) {
    return res.status(500).send({status : flase , message : error.message})
    }
}

const fetchURLProfile = async function(req,res) {
    let cachedProfileData = await GET_ASYNC(`${req.params.authorId}`)
    if(cachedProfileData) {
        res.send(cachedProfileData)
    }else {
        let profile = await URLModel.findById(req.params.authorId)
        await SET_ASYNC(`${req.params.authorId}`,JSON.stringify(profile))
        res.send({data : profile})
    }
}

module.exports.createURL = createURL
module.exports.fetchURLProfile = fetchURLProfile