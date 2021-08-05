const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDb = require('./config/db');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport); // passport config

connectDb();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// handlebar helpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
} = require('./helpers/hbs')

// Handlebars
app.engine(
    '.hbs',
    exphbs({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
        },
        defaultLayout: 'main',
        extname: '.hbs',
    })
)
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

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
}) // setting global variable
app.use(express.static(path.join(__dirname, 'public'))) // public folder

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`[+] Server started at http://localhost:${port}/`));
