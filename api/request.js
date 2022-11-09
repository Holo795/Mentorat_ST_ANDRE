const fetch = require('node-fetch');
const UserAgent = require('user-agents');

var token = '';
var userAgent = new UserAgent().toString();
var accounts = []


exports.send = (path, payload = {}) => {
    if (!path) throw new Error('Chemin non renseigné.');

    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`https://api.ecoledirecte.com/v3${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': userAgent || new UserAgent().toString(),
                    'X-Token': token || '',
                },
                body: new URLSearchParams({ data: JSON.stringify(payload) }).toString(),
            });
            const data = await res.json();

            if (data.code < 200 || data.code >= 300) {
                reject(data.message);
                return;
            }

            token = data.token;
            
            data.data.accounts[0].profile.photo_svg = await this.get_profil_picture(data.data.accounts[0].profile.photo);

            if (data.data.accounts) {
                const index = accounts.findIndex(object => object.id === data.data.accounts[0].id);
                if (index === -1) {
                    accounts.push(data.data.accounts[0]);
                } else {
                    accounts[index] = data.data.accounts[0]
                }
            }

            resolve(data.data);
        } catch (e) {
            reject(e);
        }
    });
}

exports.login = (identifiant, motdepasse) => {
    if (!identifiant || !motdepasse) throw new Error('Parametre manquant.');

    return new Promise((resolve, reject) => {
        this.send('/login.awp', {
            identifiant,
            motdepasse,
        }).then(data => {
            resolve(data)
        }).catch(err => reject(err))
    })

}

exports.get_profil_picture = (image_link) => {

    var headers =  {
        Referer: "https://www.ecoledirecte.com/",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    };

    if (!image_link) throw new Error('Parametre manquant.');
    if (!image_link.startsWith('https:')) image_link = 'https:' + image_link;

    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(image_link, {
                method: 'GET',
                headers: { ...headers},
                redirect: 'follow',
            });
            const buf = await res.buffer();
            const str =
                "data:" +
                res.headers.get("Content-Type") +
                ";base64," +
                buf.toString("base64");
            resolve(str);
        } catch (e) {
            reject(e);
        }
    });
}

exports.get_accounts = () => { return accounts }
exports.reset_token = () => { token = '' }
exports.get_token = () => { return token }