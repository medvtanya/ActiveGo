function checkBody(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send('Все поля должны быть заполнены. Ответ из мидлварки');
  } else {
    next();
  }
}

module.exports = checkBody;
