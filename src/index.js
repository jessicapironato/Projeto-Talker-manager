const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const crypto = require('crypto');
const { authorizationIsValid } = require('./middlewares/authorizationMiddleware');
const { nameIsValid } = require('./middlewares/nameMiddleware');
const { ageIsValid } = require('./middlewares/ageMiddleware');
const { rateIsValid } = require('./middlewares/rateMiddleware');
const { talkIsValid } = require('./middlewares/talkMiddleware');
const { watchedAtIsValid } = require('./middlewares/watchedMiddleware');
const { emailIsValid } = require('./middlewares/emailMiddleware');
const { passwordIsValid } = require('./middlewares/passwordMiddleware');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// requisito 1 - faz uma const chamando o arquivo, faz a readFile assíncrona, que será chamada na função get que faz a validação
const talkerPath = './talker.json';

const readFile = async () => {
  try {
    const data = await fs.readFile(join(__dirname, talkerPath), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`Arquivo apresenta erro ${error}`);
  }
};

app.get('/talker', async (req, res) => {
    const talkers = await readFile();
    if (talkers.length === 0) {
      return res.status(HTTP_OK_STATUS).json([]);
    }    
    return res.status(HTTP_OK_STATUS).json(talkers);
});

// requisito 8 >> só funciona se estiver no topo!

app.get('/talker/search',
  authorizationIsValid,
  async (req, res) => {
  const { q } = req.query;
  const talkers = await readFile();

  const filteredTalkers = q ? talkers.reduce((acc, obj) => {
    if (obj.name.includes(q)) {
      acc.push(obj);
    }
    return acc;
  }, []) : talkers;

  res.status(200).json(filteredTalkers);
});

// requisito 2

app.get('/talker/:id', async (req, res) => {
    const talkers = await readFile();
    const talker = talkers.find(({ id }) => id === Number(req.params.id));

    if (!talker) {
      return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(HTTP_OK_STATUS).json(talker);
});

// requisito 3 A const crypto e a função generetaRandomToken foram retiradas do exercicio do DIA 4 do course
// requisito 4 feito 2 middlewares para validação e encadeados no post

const generateRandomToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', emailIsValid, passwordIsValid, (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = generateRandomToken();
    return res.json({ token });
  }
  res.status(400).json({ error: 'Email e senha são obrigatórios' });
});

app.post('/talker', 
  authorizationIsValid,
  nameIsValid, 
  ageIsValid,
  talkIsValid, 
  watchedAtIsValid,
  rateIsValid,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await readFile();
    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk,
    };
    fs.writeFile('./src/talker.json', JSON.stringify([...talkers, newTalker]), 'utf-8');  
    return res.status(201).json(newTalker);
  });

// requisito 6

app.put('/talker/:id', 
  authorizationIsValid,
  nameIsValid, 
  ageIsValid,
  talkIsValid, 
  watchedAtIsValid,
  rateIsValid,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await readFile();
    const talker = talkers.find(({ id }) => id === Number(req.params.id));

    if (!talker) {
      return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
    }   
    talker.name = name;
    talker.age = age;
    talker.talk = talk;
 
    fs.writeFile('./src/talker.json', JSON.stringify([...talkers, talker]), 'utf-8');
    return res.status(HTTP_OK_STATUS).json(talker);
});

// requisito 7

app.delete('/talker/:id', 
  authorizationIsValid,
  async (req, res) => {
    const talkers = await readFile();
    const talkersFiltered = talkers.filter(({ id }) => id !== Number(req.params.id));
   
    fs.writeFile('./src/talker.json', JSON.stringify(talkersFiltered), 'utf-8');
    return res.status(204).end();
  });

  // requisito 8
 
app.listen(PORT, () => {
  console.log('Online');
});
