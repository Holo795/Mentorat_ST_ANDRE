const express = require('express')
const router = express.Router()

const login = require('./login')

const data = require('../api/data')

router.get('/mentors', (req, res, next) => {
    if (!login.is_logged(req, res)) {
        res.redirect('/');
    } else {
        var info = {
            logged: login.is_logged(req, res),
            username: data.get_username(req, res),
            login_error: req.session.login_error,
        }
        res.render('users/mentors', info);
    }
})

router.get('/students', (req, res, next) => {
    if (!login.is_logged(req, res)) {
        res.redirect('/');
    } else {
        var info = {
            logged: login.is_logged(req, res),
            username: data.get_username(req, res),
            login_error: req.session.login_error,
            name: data.get_name(req, res),
            lastname: data.get_lastname(req, res),
            classe: data.get_classe(req, res),
            profil_picture: data.get_profil_picture(req, res)
        }
        res.render('users/students', info);
    }
})


router.get('*', (req, res) => {
    if (!login.is_logged(req, res)) {
        res.redirect('/');
    }
})

router.post('*', (req, res) => {
    res.redirect('/');
})


module.exports = router