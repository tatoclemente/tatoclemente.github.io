
//*--------------------------------------------------------------------------------------*/
//*                              VARIABLES GLOBALES                                      */
//* -------------------------------------------------------------------------------------*/

let productList = [
    // {
    //     id: '1',
    //     nombre: 'Carne',
    //     cantidad: '2',
    //     precio: '12.34',
    // },
    // {
    //     id: '2',
    //     nombre: 'Pan',
    //     cantidad: '3',
    //     precio: '34.56',
    // },
    // {
    //     id: '3',
    //     nombre: 'Fideos',
    //     cantidad: '4',
    //     precio: '78.90',
    // },
    // {
    //     id: '4',
    //     nombre: 'Leche',
    //     cantidad: '1',
    //     precio: '25.05',
    // }
]

// let createList = true
// let ul


//*--------------------------------------------------------------------------------------*/
//*                              FUNCIONES GLOBALES                                      */
//* -------------------------------------------------------------------------------------*/


async function renderLista() {
    const template = await $.ajax({ url: 'templates/productos.hbs' })

    const templateCompiled = Handlebars.compile(template)

    productList = await apiProducts.get()

    const html = templateCompiled({ productList: productList })

    // console.log(html);
    $('#lista').html(html)

    const ul = $('#contenedor-lista')
    componentHandler.upgradeElements(ul)
}


function renderLista2() {
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

    if (createList) {
        document.getElementById('lista').appendChild(ul)
    } else {
        componentHandler.upgradeElements(ul)
    }

    createList = false
}


async function deleteProduct(id) {

    await apiProducts.remove(id)
    renderLista()
}

async function updateValueProduct(property, id, input) {

    const index = productList.findIndex(producto => producto.id === id.toString())
    console.log(index);
    console.log('Cambiar valor producto', property, index, input);
    console.dir(input)
    const value = property === 'precio' ? parseFloat(input.value) : parseInt(input.value)

    console.log("1---> ", value);
    productList[index][property] = value

    console.log("2---> ",value);

    const product = productList[index]
    await apiProducts.put(id, product)

}

function listenerConfigure() {
    $('#btn-entrada-producto').click(async () => {
        console.log('btn-entrada-producto');

        const input = $('#ingreso-producto')
        
        const nombre = input.val()

        if (nombre) {
            console.log(nombre);
            const producto = { nombre: nombre, cantidad: 1, precio: 0 }

            await apiProducts.post(producto)
            renderLista()

            input.val('')
        }
    })

    $('#btn-borrar-productos').click(() => {

        if (productList.length) {
            let dialog = $('dialog')[0];
            dialog.showModal();
        }
    })
}

function initDialog() {
    let dialog = $('dialog')[0];

    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    $('dialog .accept').click(async () => {
        dialog.close();
        // productList.splice(0, productList.length)
        await apiProducts.removeAll()
        renderLista()
    });

    $('dialog .cancel').click(() => {
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

// async function testHandleBars() {
//     // // Ejemplo 1
//     // // compile the template
//     // const template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
//     // // execute the compiled template and print the output to the console

//     // const html= template({ doesWhat: "rocks!" })
//     // console.log(html);
//     // $('#lista').html(html)

//         // Ejemplo 2
//     // compile the template
//     // const template = Handlebars.compile("<p style='color: crimson'>{{firstname}} {{lastname}}</p>");
//     // // execute the compiled template and print the output to the console

//     // const html= template({
//     //     firstname: "Yehuda",
//     //     lastname: "Katz",
//     // })


//     //  AJAX con fetch ( then / catch )
//     // fetch('templates/test.hbs')
//     //     .then(response => response.text())
//     //     .then(template => {
//     //         console.log(template);
//     //         const templateCompiled = Handlebars.compile(template);
//     //     // execute the compiled template and print the output to the console

//     //     const html= templateCompiled({ doesWhat: "rocks!" })
//     //     console.log(html);
//     //     $('#lista').html(html)
//     //     })

//         //  AJAX con fetch ( Async / await )
//     const response = await fetch('templates/test2.hbs')
//     const template = await response.text()
//     const templateCompiled = await Handlebars.compile(template);
//         // execute the compiled template and print the output to the console

//     const html= templateCompiled({
//         firstname: "Yehuda",
//         lastname: "Katz",
//     })
//     console.log(html);
//     $('#lista').html(html)

//     // console.log(html);
//     // $('#lista').html(html)
//     // $('#lista').html('<p>{{firstname}} {{lastname}}</p>')
// }

// async function testHandleBars() {

// }

function start() {
    console.warn($('title').text());

    // testHandleBars()

    registServiceWorker()
    initDialog()
    listenerConfigure()
    renderLista()
}

//*--------------------------------------------------------------------------------------*/
//*                                   EJECUCION                                          */
//* -------------------------------------------------------------------------------------*/

// start()

// window.onload = start

$(document).ready(start)
