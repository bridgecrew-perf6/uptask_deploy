
const passport = require('passport');
const Usuarios = require('../models/Usuarios.model');
const crypto = require('crypto'); //genera token
const Sequelize = require('sequelize');
const Op =Sequelize.Op; //comparadores de sequelize
const bcrypt = require ('bcrypt-nodejs'); //hashea password

const enviarEmail = require('../handler/email.handler')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//funcion revisar si usuario esta logeado o no

exports.usuarioAutenticado = (req, res, next) => {
    //si usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }


    //si usuario NO esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')


}


//cerra sesion
exports.cerrarSesion = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}


//genera token si usuario es valido
exports.enviarToken = async (req, res) => {

    //verificar que email exista
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
    
    //si no existe el email en la bbd
    if (!usuario ) {
     
        req.flash('error', 'No existe esa cuenta')
       return res.redirect('/reestablecer')

    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; // 1 hora desde ahora

    //guardarlos en la bbdd token y expiracion
    await usuario.save();

    //url reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //envia correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reset-password.pug' //archivo pug
    });

    req.flash('correcto', 'Se ha enviado un mail para cambiar tu password')
    res.redirect('/iniciar-sesion')

}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })

    //si no encuentra el usuario por token

    if(!usuario){
        req.flash('error', 'Token no válido');
        res.redirect('/reestablecer');
    }
    console.log('usuario existe en la bb')

    //formulario para generar password

    res.render('reset-password',{
        nombrePagina: 'Reestablecer contraseña'
    })
}






//cxambia password por uno nuevo
exports.actualizarPassword = async (req, res)=>{
    //console.log(req.params.token)

    //verificar tkoen valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion:{
                [Op.gte]: Date.now()
            }
        }
    });

    //verificamos si usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }



    //el token, la fecha y el usuario son validos

//eliminamos token y expiracion de la bbdd
    usuario.token = null;
    usuario.expiracion = null;
    //hashear password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //guardar el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion');




}