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

exports.get_accounts = () => { return accounts }
exports.reset_token = () => { token = '' }
exports.get_token = () => { return token }