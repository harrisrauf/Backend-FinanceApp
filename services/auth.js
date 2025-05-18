let express = require('express');
const router = express.Router();
const executeQuery = require('../DB/db')
const jwt = require('jsonwebtoken')

const login = async function (req, res) {
    const { email, password } = req.body;
    let result = await executeQuery('SELECT * FROM public.user WHERE email= $1 AND password = $2', [email, password])
    console.log(result.rowCount)
    if (result.rowCount == 1) {
        jwt.sign({ email }, 'secrettoken', function (err, token) {
            res.send({
                token: token,
                email: email
            })
        })
    } else {
        res.sendStatus(401);
    }
};

const verifyUser = function (req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, 'secrettoken', function (err, token) {
        if (err) {
            res.sendStatus(401)
            return
        } else next();
    })
}

module.exports = { login, verifyUser };