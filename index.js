const express = require('express');
const app = express();
const morgan = require('morgan');
morgan.token('bodycontent', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :bodycontent'
  )
);
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const amountOfEntries = () => {
  return persons.length;
};

//GET
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else response.status(404).end();
});

app.get('/info', (request, response) => {
  const processDate = new Date();
  const infoback = `Phonebook has info for ${amountOfEntries()} people <br> ${processDate}`;
  console.log(request.date);
  response.send(infoback);
});
//POST

app.post('/api/persons', (req, res) => {
  const person = req.body;
  //if empty
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'missing info',
    });
  }

  persons.filter((per) => {
    if (per.name === person.name) {
      return res.status(400).json({
        error: 'name already exists',
      });
    }
  });

  const newPerson = {
    name: person.name,
    number: person.number,
    id: Math.floor(Math.random() * 6000),
  };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

//DELETE
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//server start
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
