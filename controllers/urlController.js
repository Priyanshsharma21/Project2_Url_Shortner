const Url = require('../models/urlModel.js')
var validUrl = require('valid-url');



const getUrl = async (req, res) => {
    try {
        const {
            urlCode
        } = req.params


        const url = await Url.findOne({
            urlCode
        })

        if (!url) {
            return res.status(404).json({
                status: false,
                message: 'URL not found',
            });
        }

        res.status(200).send({
            status: true,
            data: {
                url
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}



const postUrl = async (req, res) => {
    try {
        const {
            longUrl
        } = req.body

        if(!longUrl){
            return res.status(400).send({status : false, message : "Missing LongUrl"})
        }

        if (!validUrl.isUri(longUrl)) {
            res.status(400).send({
                status: false,
                message: "Invailed Url format"
            })
        } 


        const post = await Url.create(req.body)

        res.status(201).send({
            status: true,
            data: post
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}






module.exports.getUrl = getUrl
module.exports.postUrl = postUrl