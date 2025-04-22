import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEmbedding } from './generate-embedding.mjs';

// 获取当前路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'embeddings.json');

// 加载本地 embedding 数据
function loadEmbeddings() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

// 归一化后的余弦相似度算法
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

// 主入口函数
export async function matchQuestion(inputText) {
  const inputEmbedding = await getEmbedding(inputText);
  const db = loadEmbeddings();

  const scored = db.map(item => ({
    question: item.question,
    answer: item.answer,
    score: cosineSimilarity(inputEmbedding, item.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0]; // 只返回最相似的一个结果
}
