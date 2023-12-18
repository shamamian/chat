const Router = require("express").Router;
const router = new Router();
const authRouter = require("./auth/auth.router");

router.use("/auth", authRouter);

module.exports = router;