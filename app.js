const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.use(express.static('public'));

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(loggingMiddleware);

let tasks = [];

//routes

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1, 
    description: req.body.description,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask); 
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].description = req.body.description;
    tasks[taskIndex].completed = req.body.completed || false;
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.sendStatus(204); 
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something broke!' });
});

app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

// Start server
app.listen(port, () => {
  console.log(`Todo List app listening at http://localhost:${port}`);
});