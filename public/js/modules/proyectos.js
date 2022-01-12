import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.getElementById('eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e)=>{
        const urlProyecto = e.target.dataset.proyectoUrl;

        


        Swal.fire({
            title: 'Deseas eliminar el proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, {
                    params: {urlProyecto}
                }).then((respuesta)=>{
                    console.log(respuesta)


              Swal.fire(
                'Borrado',
                respuesta.data,
                'success'
              )
    
              setTimeout(() => {
                  window.location.href = '/'
              }, 2000);
                }).catch(()=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar el proyecto'
                    })
                })


            }
          })
    })
}

export default btnEliminar;