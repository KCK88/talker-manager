const talkerToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  } if (typeof token !== 'string' || token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

module.exports = talkerToken;