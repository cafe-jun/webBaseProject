const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('./model/User');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());
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

app.post('/login', (req, res) => {
    // 요청된 이메일을 데이터 베이스에서 있는지 찾습니다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSucess: false,
                message: '일치하는 유저가 존재하지 않습니다.',
            });
        }
        // 요청된 이메일이 데이터 베이스에 있다면 패스워드가 맞는지 확인해야 합니다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSucess: false, message: '패스워드가 일치하지 않습니다.' });
            // 비밀번호 까지 맞다면 토큰을 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                // 토큰을 저장한다  쿠키, localStorage
                res.cookie('x_auth', user.token).status(200).json({ loginSucess: true, userId: user._id });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
