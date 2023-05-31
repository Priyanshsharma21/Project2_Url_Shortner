const express = require('express')
const { getUrl,postUrl } = require("../controllers/urlController.js")

const router = express.Router()


router.get('/:urlCode', getUrl)
router.post('/url/shorten', postUrl)


module.exports = router