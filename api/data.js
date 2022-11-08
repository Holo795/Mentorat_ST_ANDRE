const login = require('../routes/login')

function get_username(req, res) {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).identifiant
    } else {
        return " "
    }
}

module.exports.get_username = get_username;