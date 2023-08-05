const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

router.post('/db', controller.createDB);
router.delete('/db', controller.dropDownDB);

module.exports = router;
