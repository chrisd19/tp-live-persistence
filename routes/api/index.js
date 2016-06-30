var express = require('express');
var router = express.Router();

router.get('/hotels', require('./attractions'));
router.get('/restaurants', require('./attractions'));
router.get('/activities', require('./attractions'));

router.use('/days', require('./days'));

module.exports = router;
