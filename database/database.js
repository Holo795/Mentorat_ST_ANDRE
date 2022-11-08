var sqlite3 = require('sqlite3').verbose();;
var db = new sqlite3.Database('./database/database.db');    

//promise with then and catch
function initialize(db) {
    return new Promise((resolve) => {
        db.serialize(function() {
            db.all(`CREATE TABLE IF NOT EXISTS users (
                userid INTEGER NOT NULL UNIQUE,
                nom CHAR(50) NOT NULL,
                prenom CHAR(50) NOT NULL,
                classe TEXT NOT NULL DEFAULT '{}',
                photo TEXT NULL DEFAULT NULL,
                contacts TEXT DEFAULT '{}',
                mentor CHAR(5) NOT NULL DEFAULT 'false',
                PRIMARY KEY("userid"))`, 
            function(err) {
                if (err) {
                    console.log(err)
                } else {
                    resolve();
                }
            });
        });
    });
}

function add_user(data) {
    initialize(db).then(() => {

        db.all(`REPLACE INTO users (userid, nom, prenom, classe, photo) 
        VALUES (${data.id}, '${data.nom}', '${data.prenom}', '${JSON.stringify(data.profile.classe)}', 'https:${data.profile.photo}')`, function(err, rows) {
            if (err) {
                console.log(err)
            }
        });
    
        db.close();
    });
}

function get_user(id) {
    initialize(db)

    db.all(`SELECT * FROM users WHERE userid = ${id}`, function(err, rows) {
        if (rows.length > 0) {
            return rows[0];
        } else {
            return false;
        }
    });

    db.close();
}

function set_mentor(mentor, id) {
    initialize(db)

    db.run(`UPDATE users SET mentor = ? WHERE userid = ?`, [mentor, id]);

    db.close();
}

function set_contacts(contacts, id) {
    initialize(db)

    db.run(`UPDATE users SET contacts = ? WHERE userid = ?`, [JSON.stringify(contacts), id]);

    db.close();
}

function is_mentor(id) {
    initialize(db)

    var mentor = false;

    db.all(`SELECT * FROM users WHERE userid = ${id}`, function(err, rows) {
        if (rows.length > 0) {
            mentor = rows[0].mentor;
        }
    }).then(() => {
        db.close();
        return mentor;
    });
}

function get_contacts(id) {
    initialize(db)

    var contacts = {};

    db.all(`SELECT * FROM users WHERE userid = ${id}`, function(err, rows) {
        if (rows.length > 0) {
            contacts = JSON.parse(rows[0].contacts);
        }
    }).then(() => {
        db.close();
        return contacts;
    });
}

module.exports.add_user = add_user;
module.exports.get_user = get_user;
module.exports.set_mentor = set_mentor;
module.exports.set_contacts = set_contacts;
module.exports.is_mentor = is_mentor;
module.exports.get_contacts = get_contacts;


// Path: database\database.js