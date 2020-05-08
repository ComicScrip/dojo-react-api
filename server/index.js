const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const uniqid = require('uniqid');
const moment = require('moment');

const PORT = process.env.PORT || 5000;
const GET_TASKS_DELAY_MS = 1000;
const POST_TASK_DELAY_MS = 300;
const PATCH_TASK_DELAY_MS = 200;
const DELETE_TASK_DELAY_MS = 300;

let tasks = [
  { id: uniqid(), name: 'be wild', done: true, createdAt: moment().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss') },
  { id: uniqid(), name: 'begin this dojo', done: true, createdAt: moment().subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss') },
  { id: uniqid(), name: 'finish this dojo', done: false, createdAt: moment().format('YYYY-MM-DD HH:mm:ss') }
];

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', (req, res) => {
  setTimeout(() => {
    res.json(tasks);
  }, GET_TASKS_DELAY_MS);
});

app.delete('/tasks/:id', (req, res) => {
  setTimeout(() => {
    const { id } = req.params;
    const existingTask = _.find(tasks, { id });
    if (existingTask) {
      tasks = tasks.filter(t => t.id !== id);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }, DELETE_TASK_DELAY_MS);
});

app.patch('/tasks/:id', (req, res) => {
  setTimeout(() => {
    const { id } = req.params;
    const { done } = req.body;
    const existingTask = _.find(tasks, { id });
    if (existingTask) {
      existingTask.done = done;
      res.json(existingTask);
    } else {
      res.sendStatus(404);
    }
  }, PATCH_TASK_DELAY_MS);
});

app.post('/tasks', (req, res) => {
  setTimeout(() => {
    const { name, done } = req.body;
    const existingTask = _.find(tasks, { name: name.toLowerCase() });

    if (existingTask) {
      res.status(400);
      return res.json({ errorMessage: `A task named "${name.toLowerCase()}" already exists on the server` });
    }

    const newTask = { id: uniqid(), name: name.toLowerCase(), done, createdAt: moment().format('YYYY-MM-DD HH:mm:ss') };
    tasks.push(newTask);
    res.json(newTask);
  }, POST_TASK_DELAY_MS);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
