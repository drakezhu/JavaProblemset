import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;

// 读取问题数据
const questionsPath = path.join(__dirname, '../src/main/resources/questions.json');
let questions = [];

function cleanJSONString(str) {
  // 移除控制字符，保留换行和制表符
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

try {
  let data = fs.readFileSync(questionsPath, 'utf8');
  // 清理无效的控制字符
  data = cleanJSONString(data);
  questions = JSON.parse(data);
  console.log(`Loaded ${questions.length} questions from questions.json`);
} catch (error) {
  console.error('Error reading questions.json:', error.message);
  // 使用默认数据
  questions = [
    {
      "id": 1,
      "category": "Java基础与核心",
      "question": "什么是Java中的多线程？",
      "answer": "Java中的多线程是指在一个程序中同时执行多个线程。",
      "difficulty": 2
    },
    {
      "id": 2,
      "category": "Java基础与核心",  
      "question": "HashMap的底层实现原理？",
      "answer": "HashMap底层采用数组+链表+红黑树的数据结构实现。",
      "difficulty": 3
    }
  ];
}

// 创建服务器
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if (req.method === 'GET') {
    if (req.url === '/api/questions') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(questions));
    } else if (req.url === '/api/categories') {
      const categories = [...new Set(questions.map(q => q.category))];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(categories));
    } else if (req.url.startsWith('/api/question/')) {
      const id = parseInt(req.url.split('/').pop());
      const question = questions.find(q => q.id === id);
      if (question) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(question));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Question not found' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`Total questions loaded: ${questions.length}`);
  console.log('Categories:', [...new Set(questions.map(q => q.category))]);
});
