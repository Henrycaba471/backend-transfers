const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connection } = require('./db/connection');
require('dotenv').config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: false}));
//app.use(bodyParser.json());

connection();

const userRoutes = require('./routes/user.routes');
const transferRoutes = require('./routes/send.routes');

app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Serving on http://localhost:' + PORT);
});