const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('./config/passport')

const helpers = require('./helpers'); //helpers vardump
//importar variables de entorno
require('dotenv').config({path: 'variables.env'});

//CREAR CONEXION A LA BBDD
const db = require('./config/db');

//importar modelos
require('./models/Proyectos.model')
require('./models/Tareas.model')
require('./models/Usuarios.model')



db.sync()
.then(()=>{
    console.log('conectado a la bbdd')
}).catch(error => console.log('error en la conexion a bbdd'));

//crear app express
const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

//habilitar rutas publicas para archivos estaticos css, js, img, etc
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug');

//habilitar bodyparser para leer datos de formulario
app.use(bodyParser.urlencoded({extended:true}))


app.use(expressValidator());



//añadir carpeta de vistas
app.set('views', path.join(__dirname, './views'))


app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar entre paginas sin volver a autenticar
app.use(session({
    secret: 'SuperSecret',
    resave: false,
    saveUninitialized: false,
}))


app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la app entera globales
app.use((req,res, next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})



//rutas
app.use('/', routes());

//iniciar app en puerto
app.listen(PORT, HOST, ()=>{
    console.log('servidor funcionando')
} )


//require('./handler/email.handler');