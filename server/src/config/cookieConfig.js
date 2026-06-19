const jwtConfig = require('./jwtConfig');

const cookieConfig = {
  access: {
    maxAge: jwtConfig.access.expiresIn,
    httpOnly: true,
  },
  refresh: {
    maxAge: jwtConfig.refresh.expiresIn,
    httpOnly: true,
    sameSite: 'none',
    path: '/',
    domain: 'localhost',
    secure: true,
  },
};

module.exports = cookieConfig;
