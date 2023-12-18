const jwt = require("jsonwebtoken");
const db = require("../models/index");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await db.models.Token.findOne({
      where: {
        userId,
      },
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await db.models.Token.create({
      userId,
      refreshToken,
    });
  }

  async removeToken(refreshToken) {
    return await db.models.Token.destroy({
      where: {
        refreshToken,
      },
    });
  }

  async findToken(refreshToken) {
    return await db.models.Token.findOne({
      where: {
        refreshToken,
      },
    });
  }
}

module.exports = new TokenService();