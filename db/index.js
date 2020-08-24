const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_db'
})

// const db = mysql.createConnection('mysql://root:rootroot@localhost/employee_db')


module.exports = db