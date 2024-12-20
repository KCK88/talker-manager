const talkerAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  } if (age < 18 && !Number.isNaN(age)) {
    return res
      .status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  } if (!Number.isInteger(age)) {
    return res
      .status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }

  next();
};

module.exports = talkerAge;