const express = require('express')

const {createURL, getUrl} = require('../controllers/urlController')

const router = express.Router()

router.post('/url/shorten', createURL)
router.get('/:urlCode', getUrl)

module.exports = router