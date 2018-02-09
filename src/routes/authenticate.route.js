
const express = require('express');

const router = express.Router();

const controller = require('../controllers/authenticate.controller');

router.post('/', controller.post);

module.exports = router;
