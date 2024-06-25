const express = require('express');
const app = express();
require('dotenv').config();
const googleRoutes = require('./routes/googleAuth');
const outlookRoutes = require('./routes/outlookAuth');
const port = 3000;

app.use(googleRoutes);
app.use(outlookRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});