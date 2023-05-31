const express = require('express')
const { getUrl,createURL } = require("../controllers/urlController.js")

const router = express.Router()


router.get('/:urlCode', getUrl)
router.post('/url/shorten', createURL)


module.exports = router