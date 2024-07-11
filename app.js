const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


let tasks = [];

//routes
app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});


app.post('/addTask', (req, res) => {
  const newTask = req.body.task;
  tasks.push(newTask);
  res.redirect('/');
});

app.get('/deleteTask/:index', (req, res) => {
  const index = req.params.index;
  tasks.splice(index, 1); 
  res.redirect('/');
});

//error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).render('error', { message: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Todo List app listening at http://localhost:${port}`);
});