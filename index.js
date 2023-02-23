const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(express.static('build'));

app.use(cors());
app.use(express.json());

morgan.token('body', function (req, res){
    return JSON.stringify(req.body);
});

app.use(morgan(function(tokens, req, res){
    return [
        tokens.method(req, res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res),'ms',
        tokens['body'](req, res)
    ].join(' ')
}));
/* app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); */
/* const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(requestLogger); */

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

/* app.put('/api/persons/') */

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});