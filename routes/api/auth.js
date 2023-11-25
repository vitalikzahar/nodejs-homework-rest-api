const express = require("express");

const { validateUser } = require("../../models/user");
const validateMiddleWare = require("../../middleware/validateMiddleware");

const AuthController = require("../../controllers/auth");
const auth = require("../../middleware/auth");

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  [validateMiddleWare(validateUser)],
  AuthController.register
);
router.post(
  "/login",
  jsonParser,
  [validateMiddleWare(validateUser)],
  AuthController.login
);
router.get("/logout", auth, AuthController.logout);
router.get("/current", AuthController.current);
module.exports = router;
