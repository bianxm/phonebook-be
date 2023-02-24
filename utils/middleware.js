const logger = require('./logger');
const morgan = require('morgan');

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
};

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'});
    } else if (error.name ==='ValidationError'){
        return response.status(400).json({error: error.message});
    }
    next(error);
};

morgan.token('body', function (req, res){
    return JSON.stringify(req.body);
});

const requestLogger = 
    morgan(function(tokens, req, res){
    return [
        tokens.method(req, res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res),'ms',
        tokens['body'](req, res)
    ].join(' ')
});

module.exports={unknownEndpoint, errorHandler, requestLogger};
