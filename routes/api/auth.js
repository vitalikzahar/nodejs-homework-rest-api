const express = require("express");

const { validateUser } = require("../../models/user");
const validateMiddleWare = require("../../middleware/validateMiddleware");

const AuthController = require("../../controllers/auth");
const UserController = require("../../controllers/user");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

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
router.patch(
  "/avatars",
  auth,
  upload.single("avatars"),
  UserController.uploadAvatar
);
router.get("/verify/:verificationToken", AuthController.verify);
router.post(
  "/verify",
  [validateMiddleWare(validateUser)],
  AuthController.verifyRepeat
);
module.exports = router;
