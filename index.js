const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('./model/User');

const config = require('./config/key');
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// application/json
app.use(bodyParser.json());
mongoose
    .connect(config.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connect Success'))
    .catch((err) => console.log('error'));

app.get('/', (req, res) => res.send('hello world !!'));

app.post('/register', (req, res) => {
    // 화원 가입할때 필요한 클라이언트에서 가져오면 데이터베이스에 넣어준다
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ sucess: false, err });
        return res.status(200).json({
            sucess: true,
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
