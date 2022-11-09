const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db'); 


const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS users (
    userid INTEGER NOT NULL UNIQUE,
    nom CHAR(50) NOT NULL,
    prenom CHAR(50) NOT NULL,
    classe TEXT NOT NULL DEFAULT '{}',
    contacts TEXT DEFAULT '{}',
    mentor CHAR(5) NOT NULL DEFAULT 'false',
    PRIMARY KEY("userid"))`;

function add_user(data) {
    db.serialize(function() {

        db.all(CREATE_TABLE, function(err) {
            if (err) {
                console.log(err)
            } else {
                db.all(`REPLACE INTO users (userid, nom, prenom, classe) 
                VALUES (${data.id}, '${data.nom}', '${data.prenom}', '${JSON.stringify(data.profile.classe)}')`, function(err) {
                    if (err) {
                        console.log(err)
                    }
                });
            }
        });
    });
}

process.on('SIGINT', function() {
    db.close();
    process.exit();
});

module.exports.add_user = add_user;

// Path: database\database.js