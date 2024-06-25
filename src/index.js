const express = require('express');
const fs = require('fs').promises;
const crypto = require('crypto');
const validateLogin = require('./validations/login');
const talkerName = require('./validations/talkerName');
const talkerAge = require('./validations/talkerAge');
const talkerTalk = require('./validations/talkerTalk');
const talkerToken = require('./validations/talkerToken');
const talkerWatchedAt = require('./validations/talkerWatchedAt');
const talkerRate = require('./validations/talkerRate');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
const talkPath = './src/talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const fileContent = await fs.readFile(talkPath, 'utf8');
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
    const fileContent = await fs.readFile(talkPath, 'utf8');
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

app.post('/login', validateLogin, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});

app.post('/talker',
  talkerToken,
  talkerName,
  talkerAge,
  talkerTalk,
  talkerWatchedAt,
  talkerRate,
  async (req, res) => {
    try {
      const fileContent = await fs.readFile(talkPath, 'utf8');
      const talkers = JSON.parse(fileContent);
      const { name, age, talk } = req.body;
      
      const newId = talkers.length > 0 ? talkers[talkers.length - 1].id + 1 : 1;
      const newTalker = { id: newId, name, age, talk };
  
      talkers.push(newTalker);
      await fs.writeFile(talkPath, JSON.stringify(talkers, null, 2));
  
      res.status(201).json(newTalker);
    } catch (error) {
      return res.status(HTTP_OK_STATUS).json({ message: error.message });
    }
  });

app.put('/talker/:id',
  talkerToken,
  talkerName,
  talkerAge,
  talkerTalk,
  talkerWatchedAt,
  talkerRate,
  async (req, res) => {
    try {
      const { name, age, talk } = req.body;
      const { id } = req.params;
      
      const fileContent = await fs.readFile(talkPath, 'utf8');
      const talkers = JSON.parse(fileContent);
      const talkerIndex = talkers.findIndex((talkerId) => talkerId.id === parseInt(id, 10));
        
      if (talkerIndex === -1) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }    
      talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };
      await fs.writeFile(talkPath, JSON.stringify(talkers, null, 2));
      console.log(talkers[talkerIndex]);
      res.status(200).json(talkers[talkerIndex]);    
    } catch (error) {
      return res.status(HTTP_OK_STATUS).json({ message: error.message });
    }
  });

app.listen(PORT, () => {
  console.log('Online');
});
