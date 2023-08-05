const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

router.post('/db', controller.createDB);
router.delete('/db', controller.dropDownDB);
router.get('/db', controller.generateMockData);

module.exports = router;
