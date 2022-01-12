
const Proyectos = require('../models/Proyectos.model');
const Tareas = require('../models/Tareas.model');

//const slug = require('slug')

exports.proyectosHome = async (req, res) => {
    //console.log(res.locals.usuario)
    //consultamos al modelo Proyectos que tiene todos los datos
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    //findAll() trae toda la tabla Proyectos que le pasamos la vista
    res.render('index.pug', {
        nombrePagina: 'Proyectos',
        proyectos,
    });
};


exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevo-proyecto.pug', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};


exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    //res.send('enviaste el form');
    //console.log(req.body)

    //validar input
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevo-proyecto.pug', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        //insertar en la bbdd imporitamos el modelo antes
        //const url = slug(nombre).toLocaleLowerCase();
        const usuarioId = res.locals.usuario.id
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/')
    }
};


exports.proyectoPorUrl = async (req, res, next) => {
    //findOne solo trae un proyecto
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    //consultar tareas de proyecto actual
    //proyectoId es una columna de la tabla tareas
    const tareas = await Tareas.findAll(
        {
            where: {proyectoId: proyecto.id},
            // include: [
            //     {model: Proyectos}
            // ]
        })

    


    //si no hay resultados mostramos error
    if (!proyecto) return next()
    res.render('tareas.pug', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const proyecto = await Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    res.render('nuevo-proyecto.pug', {
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    })
}





exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    

    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevo-proyecto.pug', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        //insertar en la bbdd imporitamos el modelo antes
        //const url = slug(nombre).toLocaleLowerCase();
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id} }
            );
        res.redirect('/')
    }
};

exports.eliminarProyecto = async(req, res, next)=>{
    //console.log(req)
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where:{
        url: urlProyecto
    }})

    if(!resultado){
        return next();
    }
    res.send('Proyecto eliminado correctamente')
}