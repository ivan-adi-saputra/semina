const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: process.env.jwtExpiration,
  jwtSecret: process.env.jwtSecret,
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  gmail: process.env.GMAIL,
  password: process.env.PASSWORD,
};
