import express from 'express';
import cors from 'cors';
import { matchQuestion } from './match.mjs';
import { getEmbedding } from './generate-embedding.mjs';
import fs from 'fs/promises'; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/match', async (req, res) => {
  const { question } = req.body;
  const result = await matchQuestion(question);
  res.json(result);
});

app.post('/sync', async (req, res) => {
  const { question, answer } = req.body;

  // 保存或追加向量
  const embedding = await getEmbedding(question);
  const existing = await fs.readFile('./data/embeddings.json', 'utf-8');
  const list = JSON.parse(existing);

  list.push({ question, answer, embedding });
  await fs.writeFile('./data/embeddings.json', JSON.stringify(list, null, 2));

  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('✅ Server listening at http://localhost:3000');
});
