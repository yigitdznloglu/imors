const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.get('', authController.getThisUser);

router.use(checkBodyForLongValues, validateAndFormatEmailParams);

router.post('', authController.login);

module.exports = router;

