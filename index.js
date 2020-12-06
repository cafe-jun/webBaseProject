const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://jsshin:jsshin942556@cluster0.i5taf.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connect Success'))
    .catch((err) => console.log('error'));
app.get('/', (req, res) => res.send('hello world !!'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
