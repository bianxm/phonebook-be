const express = require('express');
const app = express();
app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people.<br /> 
        ${Date()}`);
});

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === +request.params.id);

    if(person) response.json(person);
    else response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== +request.params.id);
    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random()*100000);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if(!body.name || !body.number) return response.status(400).json(
        {error: 'Info missing'}
    );
    if(persons.some(person => person.name === body.name)) return response.status(400).json(
        {error: 'Name already exists in phonebook'}
    );
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person);
    response.json(body);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});