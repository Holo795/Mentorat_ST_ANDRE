const express = require('express')
const router = express.Router()

const login = require('./login')

router.get('/mentors', (req, res, next) => {
    if (!login.is_logged(req, res)) {
        res.redirect('/');
    } else {
        res.render('users/mentors', login.get_data(req, res, next));
    }
})

router.get('/students', (req, res, next) => {
    if (!login.is_logged(req, res)) {
        res.redirect('/');
    } else {
        res.render('users/students', login.get_data(req, res, next));
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