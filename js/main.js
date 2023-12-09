
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


//** -----------------LOCALSTORAGE-------------- */

function guardarListaProductos(lista) {
  localStorage.setItem('lista', JSON.stringify(lista))
}

function leerListaProductos() {
  let lista = []
  const prods = localStorage.getItem('lista')
  if (prods) {
    try {
      lista = JSON.parse(prods)
    }
    catch {
      guardarListaProductos(lista)
    }
  }
  return lista
}
//**------------------------------------------------------ */


async function renderLista() {
  const template = await $.ajax({ url: 'templates/productos.hbs' })

  const templateCompiled = Handlebars.compile(template)

  productList = await apiProducts.get()
  guardarListaProductos(productList)

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

  console.log("2---> ", value);

  const product = productList[index]
  await apiProducts.put(id, product)

  guardarListaProductos(productList)

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
        // reg.onupdatefound = () => {
        //   const installingWorker = reg.installing
        //   installingWorker.onstatechange = () => {
        //     console.log('SW --> ', installingWorker.state);

        //     if (installingWorker.state === 'activated') {
        //       console.error('reinicio en 2 seg');
        //       setTimeout(() => {
        //         console.log('OK');
        //         location.reload()
        //       }, 2000)

        //     }
        //   }
        // }
      })
      .catch(err => {
        console.warn('Error al tratar de registrar el service worker', err)
      })
  } else {
    console.error('El service worker no existe en el navegador')
  }
}

async function testHandleBars() {
    // // Ejemplo 1
    // // compile the template
    // const template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
    // // execute the compiled template and print the output to the console

    // const html= template({ doesWhat: "rocks!" })
    // console.log(html);
    // $('#lista').html(html)

        // Ejemplo 2
    // compile the template
    // const template = Handlebars.compile("<p style='color: crimson'>{{firstname}} {{lastname}}</p>");
    // // execute the compiled template and print the output to the console

    // const html= template({
    //     firstname: "Yehuda",
    //     lastname: "Katz",
    // })


    //  AJAX con fetch ( then / catch )
    // fetch('templates/test.hbs')
    //     .then(response => response.text())
    //     .then(template => {
    //         console.log(template);
    //         const templateCompiled = Handlebars.compile(template);
    //     // execute the compiled template and print the output to the console

    //     const html= templateCompiled({ doesWhat: "rocks!" })
    //     console.log(html);
    //     $('#lista').html(html)
    //     })

        //  AJAX con fetch ( Async / await )
    const response = await fetch('templates/test2.hbs')
    const template = await response.text()
    const templateCompiled = await Handlebars.compile(template);
        // execute the compiled template and print the output to the console

    const html= templateCompiled({
        firstname: "Yehuda",
        lastname: "Katz",
    })
    console.log(html);
    $('#lista').html(html)

    // console.log(html);
    // $('#lista').html(html)
    // $('#lista').html('<p>{{firstname}} {{lastname}}</p>')
}


//https://caniuse.com/
function testCache() {
  if (window.caches) {
    console.log(window.caches);

    //creo espacios de cache
    caches.open('test-cache')
    caches.open('test-cache2')
    caches.open('test-cache3')

    //Comprobamos si un cache existe
    caches.has('test-cache2').then(console.log)

    caches.has('test-cache3').then(console.log)
    // caches.has('test-cache').then(alert)

    // caches.has('test-cache').then(console.log)


    //Borrar un cache

    caches.delete('test-cache2').then(console.log)

    // Listo todos los nombre de caches
    caches.keys().then(console.log)

    // // Abro un cache y trabajo con el
    caches.open('cache-v1.1').then(cache => {


      // Agrago un recurso al cache
      // cache.add('/index.html')
      // console.log(cache);
    //   //Agrego varios recurso al cache

      cache.addAll([
        '/index.html', 
        '/css/styles.css', 
        '/images/img-superlista.jpeg'
      ])
      .then(() => {
        console.log('Recursos agregados')

        cache.delete('/css/styles.css').then(console.registerDialog)

        // cache.match('/index.html').then(res => {
          cache.match('/css/styles.css').then(res => {
          if (res) {
            console.log('Recurso encontrado');
    //         // Accedo al contenido del recurso
            res.text().then(console.log)
          } else {
            console.log('Recurso no encontrado');
          }
        })
      })
        /*Creo o modifico un recurso en el cache*/
        cache
        .put('/index.html', new Response('<p>Hola mundo</p>', { headers: { 'Content-Type': 'text/html' } }))
        

        cache.keys().then(recursos => console.log('Recursos del cache', recursos))
        cache.keys().then(recursos => {
          recursos.forEach(recurso => {
            console.log(recurso.url);
          })
        })

        caches.keys().then(nombres => console.log('Nombres del cache', nombres))
        caches.keys().then(nombres => {
          nombres.forEach(nombre => {
            console.log(nombre);
          })
        })
      })
  } else {
    console.log('El navegador no soporta Cache');
  }
}




function start() {
  console.warn($('title').text());

  // testHandleBars()
  // testCache()

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
