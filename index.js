const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

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
/*     response.json(persons); */
    Person.find({}).then(person => {response.json(person)});
});

app.get('/info', (request, response) => {
/*     response.send(
        `Phonebook has info for ${persons.length} people.<br /> 
        ${Date()}`); */
        Person.countDocuments({}).then(docCount => {
            response.send(`Phonebook has info for ${docCount} people.<br />
            ${Date()}`);
        }).catch(err => {
            console.log(err);
            response.send(`Error`);
        });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person)response.json(person);
        else response.status(404).end();
    }).catch(error => {
/*         console.log(error);
        response.status(400).send({error: 'malformatted id'}); */
        next(error);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        }).catch(error => next(error))
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;
/*     if(!body.name || !body.number) return response.status(400).json(
        {error: 'Info missing'}
    ); */
    if(persons.some(person => person.name === body.name)) return response.status(400).json(
        {error: 'Name already exists in phonebook'}
    );
    const person = new Person({
        name: body.name,
        number: body.number,
/*         id: generateId() */
    });
    person.save().then(savedPerson => {
        response.json(savedPerson);
    }).catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;

/*     if(!body.name || !body.number) return response.status(400).json(
        {error: 'Info missing'}
    );
    const person = {
        name: body.name,
        number: body.number
    }; */
    Person.findByIdAndUpdate(request.params.id, 
        {name, number}, 
        {new:true, runValidators: true, context: 'query'})
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'});
    } else if (error.name ==='ValidationError'){
        return response.status(400).json({error: error.message});
    }
    next(error);
};

app.use(errorHandler);

const PORT =  process.env.PORT || 3001 ; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});