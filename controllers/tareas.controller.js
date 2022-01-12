const Tareas = require('../models/Tareas.model');
const Proyectos = require('../models/Proyectos.model');



exports.agregarTarea = async (req, res, next) => {
  //obtener proyeccto actual
    const proyecto = await Proyectos.findOne({
      where: {url: req.params.url}
  });
  
 //leer valor de input agregar tarea - tarea es el name del input en tareas.pug
 const {tarea} = req.body;
 const estado = 0; //tarea no terminada por default

 //id del proyecto al que pertenece la tarea que estamos agregando
 const proyectoId = proyecto.id;

 //insertar en la bbdd
const resultado = await Tareas.create({tarea, estado, proyectoId});

if(!resultado){
    return next();
}
 //redireccionar
 res.redirect(`/proyectos/${req.params.url}`)




};

exports.actualizarEstadoTarea = async (req,res,next)=>{
 
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {id: id}})
    //console.log(tarea)

    //cambiar estado tarea
//si tarea esta en 1 al presionar cambia a 0
//caso contrario, si tarea esta en 0 cambia a 1
    let estado = 0;
    if(tarea.estado === estado){
         estado = 1;
    } 
    tarea.estado = estado;

    const resultado =await tarea.save();

    if(!resultado){
        return next();
    }
    


    res.status(200).send('actualizado')
}

exports.eliminarTarea = async (req,res,next)=>{
   
    const {id} = req.params;
    //console.log(id)
    //eliminar tarea
    const resultado = await Tareas.destroy({where: {id:id}})

    if(!resultado){
        return next();
    }


    res.status(200).send('eliminando')
}