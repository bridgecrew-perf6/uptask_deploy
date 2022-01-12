const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid')

//CORRESPONDE A LA DEFINICION DE UNA TABLA EN LA BBDD
const Proyectos = db.define('proyectos',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    url: {
        type: Sequelize.STRING(100),
    }
}, {
    hooks:{
        beforeCreate(proyecto) {
            //console.log('antes de insertar en la bbdd')
            const url = slug(proyecto.nombre).toLocaleLowerCase();

            proyecto.url= `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos; 
