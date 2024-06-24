const express = require('express');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const fileContent = await fs.readFile('./src/talker.json', 'utf8');
    const talkers = JSON.parse(fileContent);

    if (!talkers.length > 0) {
      return res.status(HTTP_OK_STATUS).json([]);
    }
    res.status(HTTP_OK_STATUS).json(talkers);
  } catch (error) {
    return res.status(HTTP_OK_STATUS).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const fileContent = await fs.readFile('./src/talker.json', 'utf8');
    const talkers = JSON.parse(fileContent);

    const talkersById = talkers.find((talker) => talker.id === id);
    if (!talkersById) {
      res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    res.status(HTTP_OK_STATUS).json(talkersById);
  } catch (error) {
    return error.message('Erro de requisição');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regex.test(email)) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
