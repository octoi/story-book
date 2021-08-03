const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');

dotenv.config({ path: './config/config.env' });

const app = express();

connectDb();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`[+] Server started at http://localhost:${port}/`));
