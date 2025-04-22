// 📁 generate-embedding.mjs
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

console.log(44);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

export async function generateEmbeddingsFromFile(inputPath = './data/questions.json', outputPath = './data/embeddings.json') {
  const raw = await fs.readFile(inputPath, 'utf-8');
  const questions = JSON.parse(raw);
  const results = [];

  for (const q of questions) {
    const embedding = await getEmbedding(q.question); // ✅ 修正这行
    results.push({ question: q.question, answer: q.answer, embedding }); // ✅ 全量写入
    console.log(`✅ Embedded: ${q.question}`);
  }

  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`🎉 All embeddings saved to ${outputPath}`);
}

// ✅ 主执行函数
generateEmbeddingsFromFile().catch(err => {
  console.error("❌ 生成向量失败：", err);
});