const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const { validateSession } = require("../controllers/session");
const {
  checkBodyForLongValues,
  validateAndFormatEmailParams,
  validatePasswordForm,
} = require("../controllers/filter");

router.use(checkBodyForLongValues, validateAndFormatEmailParams);

router.post("", validatePasswordForm, userController.createUser);
router.use(validateSession);
router.get("", userController.getUserByEmail);
router.put("/updateUsername", userController.updateUsername);
router.put("/updateEmail", userController.updateEmail);
router.put("/changePassword", userController.changePasswordByEmail);
router.delete("", userController.deleteUser);

module.exports = router;
