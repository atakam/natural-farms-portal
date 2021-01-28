const mysql = require("mysql");

const db = mysql.createConnection({
    host     : '162.241.224.239',
    user     : 'sihoneco_nfarms',
    password : 'LvdXfmECPs%;',
    database : 'sihoneco_naturalfarms'
});

module.exports = db;