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

const generateRandomToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = generateRandomToken();
    return res.json({ token });
  }
  res.status(400).json({ error: 'Email e senha são obrigatórios' });
});

app.listen(PORT, () => {
  console.log('Online');
});
