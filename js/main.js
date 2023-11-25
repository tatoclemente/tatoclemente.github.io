
//*--------------------------------------------------------------------------------------*/
//*                              VARIABLES GLOBALES                                      */
//* -------------------------------------------------------------------------------------*/

const productList = [
    {
        nombre: 'Carne',
        cantidad: '2',
        precio: '12.34',
    },
    {
        nombre: 'Pan',
        cantidad: '3',
        precio: '34.56',
    },
    {
        nombre: 'Fideos',
        cantidad: '4',
        precio: '78.90',
    },
    {
        nombre: 'Leche',
        cantidad: '1',
        precio: '25.05',
    }
]

let createList = true
let ul


//*--------------------------------------------------------------------------------------*/
//*                              FUNCIONES GLOBALES                                      */
//* -------------------------------------------------------------------------------------*/
function renderLista() {
    // <ul class="demo-list-icon mdl-list">
    if (createList) {
        // console.log(createList);
        ul = document.createElement('ul')
        ul.classList.add('demo-list-icon', 'mdl-list')
    }

    ul.innerHTML = ''

    productList.forEach((producto, index) => {

        ul.innerHTML +=
            `
                <li class="mdl-list__item">
                <!-- Product Icon -->
                <span class="mdl-list__item-primary-content w-10">
                    <i class="material-icons mdl-list__item-icon">shopping_cart</i>
                </span>
                <!-- Product Name -->
                <span class="mdl-list__item-primary-content w-30">
                    ${producto.nombre}
                </span>
                <!-- Product Quanity -->
                <!-- Product individual erased button of product list-->
                <span class="mdl-list__item-primary-content w-30">
                    <!-- Textfield with Floating Label -->
                    <div
                    class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                    >
                    <input
                        onchange="updateValueProduct('cantidad', ${index}, this)"
                        value=${producto.cantidad}
                        class="mdl-textfield__input"
                        type="text"
                        id=${index}
                    />
                    <label class="mdl-textfield__label" for="cantidad-${index}"
                        >Cantidad</label
                    >
                    </div>
                </span>
                <!-- Product Price -->
                <span class="mdl-list__item-primary-content w-30">
                    <!-- Textfield with Floating Label -->
                    <div
                    class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                    >
                    <input
                        onchange="updateValueProduct('precio', ${index}, this)"   
                        value=${producto.precio} 
                        class="mdl-textfield__input" 
                        type="text" 
                        id=${index} />
                    <label class="mdl-textfield__label" for="precio-${index}"
                        >Precio</label
                    >
                    </div>
                </span>
                <!-- Product Quanity -->
                <span class="mdl-list__item-primary-content">
                    <!-- Colored FAB button with ripple -->
                    <button
                    onClick="deleteProduct(${index})"
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"
                    >
                    <i class="material-icons">
                    remove_shopping_cart</i>
                    </button>
                </span>
                </li>
            `
    })

    if(createList) {
        document.getElementById('lista').appendChild(ul)
    } else {
        componentHandler.upgradeElements(ul)
    }

    createList = false
}


function deleteProduct(index) {

    // console.log("borrar producto", index);
    productList.splice(index, 1)
    renderLista()
}

function updateValueProduct(property, index, input) {

    const value = property === 'precio' ? parseFloat(input.value) :  parseInt(input.value)
    productList[index][property] = value
    renderLista()
}

function listenerConfigure() {
    document.getElementById('btn-entrada-producto').addEventListener('click', () => {
        console.log('btn-entrada-producto');

        const input = document.getElementById('ingreso-producto')
        const nombre = input.value
        console.log(nombre);

        const producto = { nombre: nombre, cantidad: 1, precio: 0 }
        productList.push(producto)
        renderLista()

        input.value = ''
    })

    document.getElementById('btn-borrar-productos').addEventListener('click', () => {

        console.log('btn-borrar-productos');
        
        // if(confirm('¿Desea borrar todos los productos?'))
        // productList.splice(0, productList.length)
        // renderLista()
        var dialog = document.querySelector('dialog');
        dialog.showModal();
    
    })
}

function initDialog() {
    var dialog = document.querySelector('dialog');
    // var showDialogButton = document.querySelector('#show-dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    // showDialogButton.addEventListener('click', function() {
    //   dialog.showModal();
    // });

    dialog.querySelector('.accept').addEventListener('click', function() {
        productList.splice(0, productList.length)
        renderLista()
        dialog.close();
      });

    dialog.querySelector('.cancel').addEventListener('click', function() {
      dialog.close();
    });
}

function registServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => {
            console.log('Registrado')
        })
        .catch(err => {
            console.warn('Error al tratar de registrar el service worker', err)
        })
    } else {
        console.error('El service worker no existe en el navegador')
    }
}

function start() {
    // console.warn(document.querySelector('title').innerText);

    registServiceWorker()
    initDialog()
    listenerConfigure()
    renderLista()
}

//*--------------------------------------------------------------------------------------*/
//*                                   EJECUCION                                          */
//* -------------------------------------------------------------------------------------*/

start()