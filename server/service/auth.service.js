const UserDto = require("../dtos/user.dto");
const TokenService = require("./token.service");
const db = require("../models");
const bcrypt = require("bcrypt");

class AuthService {
  async signup(username, password, country, gender) {
    const candidate = await db.models.User.findOne({
      where: {
        username,
      },
    });
    if (candidate) {
      throw ApiError.BadRequest(
        `User with ${username} nickname already exists`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3)

    return await db.models.User.create({
      username,
      password: hashedPassword,
      country,
      gender,
    });
  }

  async signin(username, password) {
    const user = await db.models.User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw ApiError.BadRequest(`User with ${username} username doesn't exist`);
    }
    
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password`);
    }
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    return await TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await db.models.User.findOne({
      where: {
        id: userData.id,
      },
    });
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers(loggedUserId) {
    return await db.models.User.findAll({
      where: {
        id: {
          [db.sequelize.Op.ne]: loggedUserId
        }
      }
    });
  }

  async getUser(userId) {
    return await db.models.User.findOne({
      where: {
        id: userId,
      },
    });
  }
}

module.exports = new AuthService();
