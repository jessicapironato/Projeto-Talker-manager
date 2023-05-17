const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

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

app.listen(PORT, () => {
  console.log('Online');
});
