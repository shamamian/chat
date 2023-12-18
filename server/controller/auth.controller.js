const AuthService = require("../service/auth.service");
// const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api.error");

class AuthController {
   async signup(req, res, next) {
     try {
      const { username, password, country, gender } = req.body;
      res.send(
        await AuthService.signup(
          username, password, country, gender
        )
      )
     } catch(err) {
        next(err)
     }
   }

   async signin(req, res, next) {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return next(ApiError.BadRequest("validation error", errors.array()));
      // }
      const { username, password } = req.body;
      const userData = await AuthService.signin(username, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

   async getAllUsers(req, res, next) {
    const loggedUserId = req.user.id
    try {
      res.send(
        await AuthService.getAllUsers(loggedUserId)                                                                                                          
      )
    } catch(err) {
      next(err)
    }
   }

   async getUser(req, res, next) {
    try {
      res.send(
        await AuthService.getUser()
      )
    } catch(e) {
      next(err)
    }
   }
}

module.exports = new AuthController();