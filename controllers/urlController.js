const URLModel = require('../models/urlModel')
const validURL = require('valid-url')
const shortId = require('shortid')
const NodeCache = require('node-cache');
require('dotenv').config();

const { BASE_URL } = process.env


const cache = new NodeCache();




const createURL = async (req, res) => {
    try {

        const {
            longUrl
        } = req.body;

        if (!longUrl) {
            return res.status(400).send({
                status: false,
                message: "Missing LongUrl"
            })
        }

        if (!validURL.isUri(longUrl)) {
            return res.status(400).send({
                status: false,
                message: 'Invalid URL'
            })
        }

        // const alreadyExistUrl = await URLModel.findOne({longUrl})

        // if(alreadyExistUrl) return res.status(400).json({status : false, message: 'Existing URL already exists'})

        const urlCode = shortId.generate();
        // const shortUrl = `${BASE_URL}/${urlCode}`;
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
    try {
        const {
            urlCode
        } = req.params;



        const cachedUrl = cache.get(urlCode);


        if (cachedUrl) {
            // kabhi cache mai hoga to redirect kar dega directly wirhout finding it in database
            // return res.status(200).send({status : true, data:cachedUrl});
            return res.status(200).redirect(cachedUrl)
        }


        const url = await URLModel.findOne({
            urlCode
        });

        if (!url) {
            return res.status(404).json({
                status: false,
                message: 'URL not found',
            });
        }

        // Cache mai 24 hr ke lea store karega
        cache.set(urlCode, url.longUrl, 24 * 60 * 60);

        // Redirect the user to the original URL
        // return res.status(200).send({status : true, data:url.longUrl});
        return res.status(200).redirect(url.longUrl)

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