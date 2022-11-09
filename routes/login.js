const express = require('express')
const router = express.Router()

const request = require('../api/request')
const database = require('../database/database')


router.post('/', (req, res, next) => {
    const identifiant = req.body.username
    const motdepasse = req.body.password
    if (is_logged(req, res)) {
        res.redirect(req.get('referer'))
    } else {


        request.login(identifiant, motdepasse).then(data => {
            console.log(data)
            if (data.accounts[0].typeCompte === "E") {
                res.cookie('user', data.accounts[0].id, {maxAge: 360000, signed: true})
                database.add_user(data.accounts[0])
                res.redirect(req.get('referer'))
            } else {
                req.session.login_error = "Ceci n'est pas un compte étudiant";
                logout(req, res)
            }
        }).catch(err => {                       
            req.session.login_error = err;
            logout(req, res)
        });    

    }
  
})

router.get('/logout', (req, res) => {
    logout(req, res)
})

router.post('*', (req, res) => {
    if (!req.signedCookies.user) {
      res.redirect('/');
    }
})

router.get('/', (req, res) => {
    res.redirect('/');
})

function logout(req, res) {
    request.reset_token();
    res.clearCookie('user')
    res.redirect(req.get('referer'))
}


function get_data(req, res) {
    var accounts = request.get_accounts();
    var id = req.signedCookies.user;
    var index = accounts.findIndex(object => object.id.toString() === id);

    if (index === -1) { 
        return false;
    } else { 
        return accounts[index]; 
    }
}

function is_logged(req, res) {
    if (!req.signedCookies.user) {
        return false;
    } else {
        if (get_data(req, res) === false) {
            request.reset_token();
            res.clearCookie('user')
            return false;
        } else {
            return true;
        }
    }
}

module.exports = router
module.exports.is_logged = is_logged
module.exports.get_data = get_data
module.exports.logout = logout

// Path: routes\login.js