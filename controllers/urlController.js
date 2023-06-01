const URLModel = require('../models/urlModel')
const validURL = require('valid-url')
const shortId = require('shortid')

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

        const urlCode = shortId.generate();
        const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

        const data = await URLModel.create({
            urlCode,
            longUrl,
            shortUrl
        })

        res.status(201).send({
            status: true,
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