const express = require('express');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "sdfnjblsdfkbnslirdf;bnvliwravp;airsuvh paisuvdhyaibf"

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'Token is required!' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token!' });
        }
        req.decoded = decoded;
        next();
    });
};

app.get('/', (req, res) => {
    const token = req.headers.authorization
    if (token) {
        const data = jwtDecode.jwtDecode(token);

        return res.json({
            username: data.username,
        })
    }
    res.sendFile(path.join(__dirname + '/indexjwt.html'));
})

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false
    });

    if (user) {
        const token = jwt.sign({ username: user.username }, secretKey);
        res.json({ token });
    } else {
        res.status(401).send();
    }
});

app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'You are authorized!' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
