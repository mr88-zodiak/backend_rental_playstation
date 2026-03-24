const express = require("express");
const router = express.Router();
const controller = require("../api/controller/UserController");
const passport = require("../api/service/passport");
const { checkAuth } = require("../middleware/auth");

router.get("/", controller.home);

router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }), controller.googleCallback);

module.exports = router;
