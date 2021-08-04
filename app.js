const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDb = require('./config/db');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport); // passport config

connectDb();

const app = express();

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// sessions
app.use(session({
    secret: 'superSecretStuff',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(mongoose.connection),
}));

// Passport mw
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`[+] Server started at http://localhost:${port}/`));
