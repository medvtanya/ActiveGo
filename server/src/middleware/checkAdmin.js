const { User } = require('../db/models');

const checkAdmin = async (req, res, next) => {
  try {
    console.log('checkAdmin - проверяем права администратора...');
    console.log('checkAdmin - req.user:', req.user);

  
    const userId = req.user?.id;

    if (!userId) {
      console.log('checkAdmin - нет userId, возвращаем 401');
      return res.status(401).json({
        status: 401,
        message: 'Необходима авторизация',
        data: null,
        error: 'Unauthorized',
      });
    }

    const user = await User.findByPk(userId);
    console.log('checkAdmin - пользователь из БД:', {
      id: user?.id,
      isAdmin: user?.isAdmin,
      userName: user?.userName,
    });

    if (!user || !user.isAdmin) {
      console.log('checkAdmin - пользователь не админ, возвращаем 403');
      return res.status(403).json({
        status: 403,
        message: 'Доступ запрещен. Требуются права администратора',
        data: null,
        error: 'Forbidden',
      });
    }

    console.log('checkAdmin - пользователь админ, пропускаем');
  
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Ошибка при проверке прав администратора:', error);
    return res.status(500).json({
      status: 500,
      message: 'Внутренняя ошибка сервера',
      data: null,
      error: error.message,
    });
  }
};

module.exports = checkAdmin;
