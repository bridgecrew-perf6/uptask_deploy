const express = require('express');
const router = express.Router();
const {body} = require('express-validator/check')

//importar controladores
const proyectosController = require('../controllers/proyectos.controller');
const tareasController = require('../controllers/tareas.controller');
const usuariosController = require('../controllers/Usuarios.controller');
const authController = require('../controllers/Auth.controller')


module.exports = ()=>{

    router.get('/', 
    authController.usuarioAutenticado,
    proyectosController.proyectosHome );
    
    router.get('/nuevo-proyecto', 
    authController.usuarioAutenticado,
    body('nombre')
    .not()
    .isEmpty()
    .trim()
    .escape()
    , proyectosController.formularioProyecto);

    router.post('/nuevo-proyecto', 
    authController.usuarioAutenticado,
    proyectosController.nuevoProyecto);

    //listar proyectos
    router.get('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl);

    //actualizar proyecto
    router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado,
    proyectosController.formularioEditar);
    
    router.post('/nuevo-proyecto/:id', 
    authController.usuarioAutenticado,
    body('nombre')
    .not()
    .isEmpty()
    .trim()
    .escape()
    , proyectosController.actualizarProyecto);


    //eliminar proyecto
    router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);

    //agregar tareas
    router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea);

    //actualizar tarea estado terminado o no
    router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.actualizarEstadoTarea)


    //eliminar tarea
    router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea);



    //crear nueva cuenta

    router.get('/crear-cuenta', usuariosController.formCrearCuenta );
    router.post('/crear-cuenta', usuariosController.crearCuenta );
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion );
    router.post('/iniciar-sesion', authController.autenticarUsuario )


    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //recuperar contraseña
    router.get('/reestablecer', usuariosController.formRestablecer)

    router.post('/reestablecer', authController.enviarToken);
    
    router.get('/reestablecer/:token', authController.validarToken);

    router.post('/reestablecer/:token', authController.actualizarPassword)


    return router;
}