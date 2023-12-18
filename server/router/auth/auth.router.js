const Router = require("express").Router;
const authRouter = new Router();
const AuthController = require("../../controller/auth.controller")
const authMiddleware = require("../../middlewares/auth.middleware")

authRouter.post("/signup", AuthController.signup)

authRouter.post("/signin", AuthController.signin)

authRouter.post("/logout", AuthController.logout)

authRouter.get("/refresh", AuthController.refresh)

authRouter.get("/getAllUsers", authMiddleware, AuthController.getAllUsers)

authRouter.get("/getUser", authMiddleware, AuthController.getUser)

module.exports = authRouter;