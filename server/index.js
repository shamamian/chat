require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./router/router");
const errorMiddleware = require("./middlewares/error.middleware");
const db = require("./models/index");

app.use(express.json());
app.use(cookieParser(process.env.SECRET));
app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
      optionsSuccessStatus: 200,
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api", router);
app.use(errorMiddleware);

app.listen(process.env.PORT || 8080, async () => {
  await db.sequelize.sync();
});