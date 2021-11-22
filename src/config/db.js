const mysql = require('mysql2')

const conexion_db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function handleDisconnect(conexion_db) {
    connection = mysql.createPool(conexion_db);

    connection.getConnection((err) =>{
        if (err) {
            console.error('Error when connection to db', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', (err)=>{
        console.error('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}

handleDisconnect(conexion_db);
module.exports = connection;