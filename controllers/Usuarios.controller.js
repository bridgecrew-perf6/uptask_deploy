
const Usuarios = require('../models/Usuarios.model');
const enviarEmail = require('../handler/email.handler');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crear cuenta en Uptask'
    })
}


exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes
    res.render('iniciar-sesion', {
        nombrePagina : 'Iniciar sesión',
        error
    })
}

exports.crearCuenta = async(req, res) =>{

    //leer datos
    const {email, password} = req.body;
    try {
        //crear usuario
        await Usuarios.create({email, password});


        //crear url para confirmar correo
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;


        //crear objeto usuario
        const usuario = {
            email
        }


        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta.pug' //archivo pug
        });

        //redirigir al usuario
        req.flash('correcto', 'Te enviamos un email, confirma tu cuenta')
        res.redirect('/iniciar-sesion')

    } catch (error) {
        console.log('erroresssssss : ' + error)
        req.flash('error', error.errors.map(error => error.message))
        res.render('crear-cuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta',
            email,
            password
        })
    }
}


exports.formRestablecer = (req,res) =>{
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer contraseña'
    })
}

//cambia el estado de una cuenta al confirmar por email

exports.confirmarCuenta = async(req, res) =>{
    //res.json(req.params.correo)

    //traer usuario
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    //siuser no existe
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta')
    }


    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'cuenta activada corectamente');
    res.redirect('/iniciar-sesion')

}