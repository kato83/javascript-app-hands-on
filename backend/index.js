const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();
const redisClient = new Redis(process.env.REDIS_URL);

const app = express();
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

app.get('/todo', async (req, res) => {
  const prisma = new PrismaClient();
  await prisma.todo.create({
    data: {
      title: `TEST: ${new Date().toISOString()}`,
      isComplete: false,
      createdAt: new Date(),
    }
  })
  const result = await prisma.todo.findMany({});
  res.json({ message: 'HELLO WORLD!', todos: result });
});

app.post('/todo', async (req, res) => {
  const { title } = req.body;
  const todo = await prisma.todo.create({ data: { title } });
  res.json(todo);
});

app.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
