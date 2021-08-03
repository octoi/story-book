const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDb = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDb();

const app = express();

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Routes
app.use('/', require('./routes/index'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`[+] Server started at http://localhost:${port}/`));
