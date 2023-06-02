const URLModel = required('../models/urlModel.js')
const validUrl = require('valid-url') 
const shortId = require('shortid')
const redis = require('redis')

const redisClient = redis.createClient(13834 , 'edis-13834.c264.ap-south-1-1.ec2.cloud.redislabs.com:13834', {no_ready_check : true})

redisClient.auth('qMoQtZEwlww9jgVLdlOWe7deRgw9vGq',function(err){
    if(err) throw err
})

redisClient.on("connect", async function(){
    console.log('connected to redis')
})

//2 Prepare the function 

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)

const createURL = async (req,res) => {
    try {

        const {longUrl } = req.body 
        if(!longUrl) {
            return res.status(400).send({status : false , message : "Missing long URL" })
        }

        if(!validUrl.isWebUri(longUrl)) {
            return res.status(400).send({status : false , message : "Invalid Long URL"})

        }

        //checking wheather the short url exists in the cache or not 
        const cachedShortUrl = await GET_ASYNC(longUrl)
        if(cachedShortUrl) {
            return res.status(200).send({status : true , message : "URL found in cache",shortURL : cachedShortUrl})
        }

        const urlCode = shortId.generate()
        const shortId = `${process.env.BASE_URL}/${urlCode}`

        const data = await URLModel.create({urlCode , longUrl , shortUrl})

        await SET_ASYNC(longUrl , shortId)

        res.status(201).send({status : true , message : "URL Created Successfully",data : data})
   } catch(error) {
    res.status(500).send({Status : false , error : error.message })
   }

   const getUrl = async (req,res) => {
    try { 
        const {urlCode} = req.params
        const url = await URLModel.findOne({urlCode})

        if(!url) {
            return res.status(400).send({status : false , message : 'URL not found'})
        }

        return res.redirect(302 , url.longUrl)
    }catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
   }

   module.exports = {
    createURL , 
    getUrl
   }





}