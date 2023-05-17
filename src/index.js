const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const crypto = require('crypto');

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
    console.log(data);
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

const emailIsValid = (req, res, next) => {
  const regex = /\S+@\S+\.\S+/;
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  
  next();
};

const passwordIsValid = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

const generateRandomToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', emailIsValid, passwordIsValid, (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = generateRandomToken();
    return res.json({ token });
  }
  res.status(400).json({ error: 'Email e senha são obrigatórios' });
});

// requisito 5
// Middleware de autorização
const authorizationIsValid = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (typeof authorization !== 'string' || authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}; 

// Middleware de name
const nameIsValid = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}; 

// Middleware de idade
const ageIsValid = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (+(age) < 18 || !Number.isInteger(age)) {
    return res.status(400)
    .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  next();
};

// Middleware talk
const talkIsValid = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  } 
  next();
};

app.post('/talker', 
authorizationIsValid, nameIsValid, 
ageIsValid, talkIsValid, 

async (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = await readFile();
  const newTalker = {
    id: talkers.length + 1,
    name,
    age,
    talk,
  };
  talkers.push(newTalker);
  res.status(201).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
