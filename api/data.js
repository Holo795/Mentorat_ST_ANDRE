const login = require('../routes/login')
const request = require('../api/request')

exports.get_username = (req, res) => {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).identifiant
    } else {
        return " "
    }
}

exports.get_profil_picture = (req, res) => {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).profile.photo_svg
    } else {
        return ""
    }
}

exports.get_name = (req, res) => {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).prenom
    } else {
        return ""
    }
}

exports.get_lastname = (req, res) => {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).nom
    } else {
        return ""
    }
}

exports.get_classe = (req, res) => {
    if (login.is_logged(req, res)) {
        return login.get_data(req, res).profile.classe.libelle
    } else {
        return ""
    }
}