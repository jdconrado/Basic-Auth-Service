const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const middlewares = require('./middlewares');
if(process.env.ENV !== 'PRODUCTION'){
    require('dotenv').config();
}

const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

//Middlewares here

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
    origin: process.env.DOMAIN,
    credentials: true,
}));
app.use(express.json());
app.use(middlewares.verifyToken);

//ROUTES Start here

app.use('/auth', auth);
app.use('/user', user);


app.get('/', (req, res, next) =>{
    res.json({
        message : "OK.",
        user: req.user
    });
});

//Error handling

function notFound(req, res, next){
    const error = Error(`Requested ${req.path} NOT FOUND`);
    res.status(404);
    next(error);
}

function errorHandler(error, req, res, next){
    res.json({
        error: error.message,
        stack: process.env.ENV !== 'PRODUCTION' ? error.stack : ''
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 2000;

app.listen(port,function(){
    console.log(`Listening at ${port}`)
})