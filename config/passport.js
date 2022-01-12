const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

//Referencia a modelo donde autenticaremos

const Usuarios = require('../models/Usuarios.model');

//Local strategy - login con credenciales propias (email, password)

passport.use(
    new localStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) =>{
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email: email,
                        activo: 1
                    }
                });
                //el usuario existe, pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }

                //email existe y password correcto
                return done(null, usuario)
            } catch (error) {
                //usuario no existe en login
                return done(null, false, {
                    message: 'La cuenta no existe'
                })
            }
        }
    )
)


//serializar usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario)
})

//deserializar usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario)
})


module.exports = passport;