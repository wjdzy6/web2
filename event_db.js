const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20041004',
    database: 'charity_event_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

promisePool.getConnection()
    .then((connection) => {
        console.log('Successfully connected to the MySQL database: charity_event_db');
        connection.release();
    })
    .catch((err) => {
        console.error('Failed to connect to the MySQL database:', err.message);
    });

module.exports = promisePool;
