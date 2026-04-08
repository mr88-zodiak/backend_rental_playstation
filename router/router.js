const express = require("express");
const router = express.Router();
const controller = require("../api/controller/UserController");
const ProductController = require("../api/controller/ProductController");
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
router.get("/api/users/:uuid", checkAuth, controller.getUserData);
router.get("/api/users", controller.getAllUsers);
router.patch("/api/users/:uuid/update", controller.updateUser);
router.delete("/api/users/:uuid/delete", controller.deleteUser);
router.post("/api/users/:uuid/uploadAvatar", upload.single("avatar"), controller.uploadAvatar);
// CRUD PRODUCT
router.get("/api/products", ProductController.getAllProducts);
// router.get("/api/products/:id", ProductController.getProduct);
router.post("/api/products", upload.single("image"), ProductController.createProduct);
// router.put("/api/products/:id", ProductController.updateProduct);
// router.delete("/api/products/:id", ProductController.deleteProduct);
router.get("/api/getData/:uuid", checkAuth, controller.getUserData);

module.exports = router;
