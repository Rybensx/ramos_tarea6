const formulario = document.querySelector('form')
const tablaProductos = document.getElementById('tablaProductos');
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const divTabla = document.getElementById('divTabla');

btnModificar.disabled = true
btnModificar.parentElement.style.display = 'none'
btnCancelar.disabled = true
btnCancelar.parentElement.style.display = 'none'

const guardar = async (e) => {
    e.preventDefault();
    if(!validarFormulario(formulario, ['producto_id'])){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe llenar todos los campos',
          })
        // alert('Debe llenar todos los campos');
        return 
    }

    const body = new FormData(formulario)
    body.append('tipo', 1)
    body.delete('producto_id')
    const url = '/crudphp18may2023/controladores/productos/index.php';
    const config = {
        method : 'POST',
        body
    }

    try {
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        const {codigo, mensaje,detalle} = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar();
                break;
        
            case 0:
                console.log(detalle)
                break;
        
            default:
                break;
        }

        alert(mensaje);

    } catch (error) {
        console.log(error);
    }
}

const buscar = async () => {

    let producto_nombre = formulario.producto_nombre.value;
    let producto_precio = formulario.producto_precio.value;
    const url = `/crudphp18may2023/controladores/productos/index.php?producto_nombre=${producto_nombre}&producto_precio=${producto_precio}`;
    const config = {
        method : 'GET'
    }

    try {
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        tablaProductos.tBodies[0].innerHTML = ''
        const fragment = document.createDocumentFragment();
        console.log(data);
        if(data.length > 0){
            let contador = 1;
            data.forEach( producto => {
                // CREAMOS ELEMENTOS
                const tr = document.createElement('tr');
                const td1 = document.createElement('td')
                const td2 = document.createElement('td')
                const td3 = document.createElement('td')
                const td4 = document.createElement('td')
                const td5 = document.createElement('td')
                const buttonModificar = document.createElement('button')
                const buttonEliminar = document.createElement('button')

                // CARACTERISTICAS A LOS ELEMENTOS
                buttonModificar.classList.add('btn', 'btn-warning')
                buttonEliminar.classList.add('btn', 'btn-danger')
                buttonModificar.textContent = 'Modificar'
                buttonEliminar.textContent = 'Eliminar'

                buttonModificar.addEventListener('click', () => colocarDatos(producto))
                buttonEliminar.addEventListener('click', () => eliminar(producto.PRODUCTO_ID))

                td1.innerText = contador;
                td2.innerText = producto.PRODUCTO_NOMBRE
                td3.innerText = producto.PRODUCTO_PRECIO
                
                
                // ESTRUCTURANDO DOM
                td4.appendChild(buttonModificar)
                td5.appendChild(buttonEliminar)
                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)
                tr.appendChild(td4)
                tr.appendChild(td5)

                fragment.appendChild(tr);

                contador++;
            })
        }else{
            const tr = document.createElement('tr');
            const td = document.createElement('td')
            td.innerText = 'No existen registros'
            td.colSpan = 5
            tr.appendChild(td)
            fragment.appendChild(tr);
        }

        tablaProductos.tBodies[0].appendChild(fragment)
    } catch (error) {
        console.log(error);
    }
}

const colocarDatos = (datos) => {
    formulario.producto_nombre.value = datos.PRODUCTO_NOMBRE
    formulario.producto_precio.value = datos.PRODUCTO_PRECIO
    formulario.producto_id.value = datos.PRODUCTO_ID

    btnGuardar.disabled = true
    btnGuardar.parentElement.style.display = 'none'
    btnBuscar.disabled = true
    btnBuscar.parentElement.style.display = 'none'
    btnModificar.disabled = false
    btnModificar.parentElement.style.display = ''
    btnCancelar.disabled = false
    btnCancelar.parentElement.style.display = ''
    divTabla.style.display = 'none'
}

const cancelarAccion = () => {
    btnGuardar.disabled = false
    btnGuardar.parentElement.style.display = ''
    btnBuscar.disabled = false
    btnBuscar.parentElement.style.display = ''
    btnModificar.disabled = true
    btnModificar.parentElement.style.display = 'none'
    btnCancelar.disabled = true
    btnCancelar.parentElement.style.display = 'none'
    divTabla.style.display = ''
}


// const eliminar5 = (id) => {
//     if(confirm("¿Desea eliminar este producto?")){
//         alert("eliminando")
//     }
// }


const eliminar = (id) => {
    if (confirm("¿Desea eliminar este producto?")) {
        // Realizar la llamada al servidor para eliminar el producto
        fetch(`eliminar_producto.php?id=${id}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor si es necesario
            // No es necesario mostrar una alerta aquí, ya que ya mostramos un mensaje en la función buscar()
            // alert("Producto eliminado exitosamente");

            // Luego de eliminar, realizamos la petición POST tipo 3 para limpiar el formulario
            realizarAccionTipo3();
        })
        .catch(error => {
            // Manejar el error si ocurre
            console.error('Error al eliminar el producto:', error);
        });
    }
};

const realizarAccionTipo3 = () => {
    const body = new FormData(formulario);
    body.append('tipo', 3);
    body.delete('producto_id');
    const url = '/crudphp18may2023/controladores/productos/index.php';
    const config = {
        method : 'POST',
        body
    };

    fetch(url, config)
    .then(response => response.json())
    .then(data => {
        // Aquí puedes manejar la respuesta del servidor si es necesario
        alert("Acción tipo 3 realizada exitosamente");
        // También puedes realizar alguna otra acción si es necesario
    })
    .catch(error => {
        // Manejar el error si ocurre
        console.error('Error al realizar la acción tipo 3:', error);
    });
};


const modificar = async (e) => {
    e.preventDefault();
    if(!validarFormulario(formulario)){
        alert('Debe llenar todos los campos');
        return 
    }

    const body = new FormData(formulario)
    body.append('tipo', 2)
    const url = '/ramos_tarea6/controladores/productos/index.php';
    const config = {
        method : 'POST',
        body
    }

    try {
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        const {codigo, mensaje, detalle} = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar();
                break;
        
            case 0:
                console.log(detalle)
                break;
        
            default:
                break;
        }

        alert(mensaje);

    } catch (error) {
        console.log(error);
    }
}


buscar();

formulario.addEventListener('submit', guardar )
btnModificar.addEventListener('click', modificar)
btnEliminar.addEventListener('click', eliminar)
btnBuscar.addEventListener('click', buscar)
btnCancelar.addEventListener('click', cancelarAccion)