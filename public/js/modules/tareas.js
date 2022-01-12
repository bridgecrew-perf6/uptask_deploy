import Swal from 'sweetalert2';
import axios from "axios";
import {actualizarAvance} from '../modules/funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', (e)=>{
   
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('ACTUALIZANDO...')
            const tareaId = e.target.parentElement.parentElement.dataset.tarea;
            //console.log(tareaId)

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${tareaId}`;
            console.log(url)

            axios.patch(url, {tareaId})
            .then(respuesta =>{
                //console.log(respuesta)
                if(respuesta.status === 200){
                    e.target.classList.toggle('completo');
                    actualizarAvance();
                }
            })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentNode.parentNode;
             const tareaId = tareaHTML.dataset.tarea;
             const tareaNombre = e.target.parentNode.parentNode.firstChild.innerHTML;
             
             //console.log(tareaId)

             Swal.fire({
                title: `Deseas eliminar <BR> ${tareaNombre} ?`,
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                   //enviar delete por axios
                   const url = `${location.origin}/tareas/${tareaId}`;
                   axios.delete(url, {params:{tareaId}})
                   .then(respuesta =>{
                       //console.log(respuesta)
                       if(respuesta.status === 200){
                           //eliminar nodo
                           tareaHTML.parentElement.removeChild(tareaHTML);
                           actualizarAvance();

                           //opcional una alerta
                       }
                   })
                }
            
            })



        }



    })

}

export default tareas