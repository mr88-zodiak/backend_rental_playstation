const express = require("express");
const router = express.Router();
const controller = require("../api/controller/UserController");
const passport = require("../api/service/passport");
const { checkAuth } = require("../middleware/auth");
const upload = require("../middleware/uploadGambar");

router.get("/", controller.home);

router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }), controller.googleCallback);
router.post("/auth/verification/:uuid", controller.verify);
router.post("/auth/resendCode/:uuid", controller.resendCode);
// CRUD USER
router.get("/api/getData/:uuid", checkAuth, controller.getUserData);
router.get("/api/getAllUsers", controller.getAllUsers);
router.patch("/api/updateUser/:uuid", controller.updateUser);
router.delete("/api/deleteUser/:uuid", controller.deleteUser);
router.post("/api/uploadAvatar/:uuid", upload.single("avatar"), controller.uploadAvatar);

module.exports = router;
