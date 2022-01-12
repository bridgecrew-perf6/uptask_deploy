const { Sequelize } = require('sequelize');
//extraer valores de variables de entornoo
require('dotenv').config({path: 'variables.env'});

const db = new Sequelize(
    process.env.BD_NAME, 
    process.env.BD_USER, 
    process.env.BD_PASSWORD,
    {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.BD_PORT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    module.exports = db;
