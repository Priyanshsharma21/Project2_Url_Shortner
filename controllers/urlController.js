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

        if(!validURL.isUri(longUrl)){
            return res.status(400).send({
                status: false,
                message: 'Invalid URL'
            })
        }

        const urlCode = shortId.generate();
        const shortUrl = `http://localhost:3000/${urlCode}`;

        const data = await URLModel.create({
            urlCode,
            longUrl,
            shortUrl
        })

        // const newUrl = await URLModel.create(req.body)

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
    const { urlCode } = req.params;
    try {
        const url = await URLModel.findOne({ urlCode });

        const long_url = url.longUrl;

        console.log(long_url);

        if (url) {
            return res.redirect(long_url);
        } else {
            return res.status(404).send({
                status: true,
                message: 'URL not found'
            });
        }

        // return res.redirect(url.longUrl)
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