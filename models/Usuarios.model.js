
const Sequelize = require('sequelize');
const db = require('../config/db');
//importamos el modelo Proyectos para hacer la relacion Usuarios->Proyectos
const Proyectos = require('../models/Proyectos.model');
const bcrypt = require ('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        
        validate: {
            isEmail:{
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'El Email no puede estar vacío',
            }
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado'
        }

    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'El password no puede estar vacío',
            }
        }

    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
   token: {
       type: Sequelize.STRING
   },
   expiracion: {
    type: Sequelize.DATE
}

},{
    hooks:{
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//metodos personalizados

Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

//un usuario puede crear muchos Proyectos
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;

