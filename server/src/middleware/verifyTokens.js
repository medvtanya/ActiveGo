const jwt = require('jsonwebtoken');
require('dotenv').config();
const formatResponse = require('../utils/formatResponse');
const UserService = require('../services/userService');

const verifyAccessToken = async (req, res, next) => {
  try {
    console.log('verifyAccessToken - проверяем токен...');
    const accessToken = req.headers.authorization.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log('verifyAccessToken - пользователь из токена:', user);

    
    const existingUser = await UserService.getOneUser(user.id);
    if (!existingUser) {
      console.log(
        'verifyAccessToken - пользователь не найден в базе данных, id:',
        user.id
      );
      return res
        .status(401)
        .json(formatResponse(401, 'Пользователь не найден'));
    }

   
    req.user = existingUser;
    res.locals.user = existingUser;

    return next();
  } catch (error) {
    console.log('verifyAccessToken - ошибка:', error);
    return res.status(401).json(formatResponse(401, 'Unauthorized'));
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    console.log('verifyRefreshToken - проверяем refresh token...');
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      console.log('verifyRefreshToken - refresh token отсутствует');
      return res
        .status(401)
        .json(formatResponse(401, 'Refresh token отсутствует'));
    }

    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('verifyRefreshToken - пользователь из токена:', {
      id: user.id,
      userName: user.userName,
    });

    
    const existingUser = await UserService.getOneUser(user.id);
    if (!existingUser) {
      console.log(
        'verifyRefreshToken - пользователь не найден в базе данных, id:',
        user.id
      );
      return res
        .clearCookie('refreshToken')
        .status(401)
        .json(formatResponse(401, 'Пользователь не найден'));
    }

    
    res.locals.user = existingUser;

    return next();
  } catch (error) {
    console.log('verifyRefreshToken - ошибка:', error);
    return res
      .clearCookie('refreshToken')
      .status(401)
      .json(formatResponse(401, 'Unauthorized'));
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
