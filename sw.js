//Eventos Clásicos
self.addEventListener('install', e => {
    console.log('Installed');
})

self.addEventListener('activate', e => {
    console.log('Activated');
})

self.addEventListener('fetch', e => {
    const { method: metodo, url: ruta } = e.request;
    
    console.log(metodo, ruta);

    console.warn("Es un CSS?", ruta.includes('.css') ? "Si" : "No");
    
    if(ruta.includes('styles.css')) {
        console.error("Peticion de recurso CSS")

        // const respuesta = null
        const respuesta = new Response(`
            .w-10 { width: 10%; }
            .w-20 { width: 20%; }
            .w-30 { width: 30%; }
            .w-40 { width: 40%; }
            .w-50 { width: 50%; }
            .w-60 { width: 60%; }
            .w-70 { width: 70%; }
            .w-80 { width: 80%; }
            .w-90 { width: 90%; }
            .w-100 { width: 100%; }
            
            
            .nav-bar {
                background-color: #951b81;
            }
            .ml-item {
                margin-left: 20px;
            }
            
            .mdl-layout {
                min-width: 390px;
            }
            
            .menu {
                padding: 20px;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            
            
            .dialog-title {
                font-size: 2.5rem;
                line-height: 3rem;
            }
            img {
                width: 100%;
                height: 300px;
                min-width: 800px;
                object-fit: cover;
                object-position: bottom;
            }
            body {
                // background-color: red
            }
        `, { headers: { 'content-type': 'text/css' } })
        e.respondWith(respuesta)
    }

    // ---- Intervengo los recursos multimedia

    else if (ruta.includes('img-superlista.jpeg')) {
  
        // const respuesta = fetch('images/al-reves.jpeg')
        // const respuesta = fetch('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuYrclPSOGo_0MHuAAk6cT1GHQcoUJC_oQQLUJq70U8ZBn_TmpYGE0PGClCNUSfp84RT4&usqp=CAU') // Cors habilitados (CROSS ORIGIN RESOURCES SHARE)
        
        const respuesta = fetch('https://static.educalingo.com/img/en/800/grocery-store.jpg', { mode: 'no-cors'}) // CORS no habilitado
        .catch(error => console.error('Error en Fetch de Imagen:' + error.message))
        e.respondWith(respuesta)
    }

    // --------- Intercengo el Framework de estilos

    // else if (ruta.includes('https://code.getmdl.io/1.3.0/material.teal-orange.min.css')) {
    //     console.error("Peticion de recurso CSS MDL")

    //     const respuesta = fetch("https://code.getmdl.io/1.3.0/material.amber-deep_orange.min.css")
    //     e.respondWith(respuesta)
    // }

    // ----------- Intervengo el codigo de la pagina --------------

    // else if (ruta.includes('main.js')) {

    //     console.error('Me di cuenta que estas pidiendo el codigo principal');
    //     const response = fetch("https://gustavoclemente.000webhostapp.com/main.js", { mode: 'no-cors' }) // CORS NO habilitado
    //     .catch(error => console.error(`!!! ERROR EN FETCH DE CÓDIGO!!!: ${error.message}`))
    //     e.respondWith(response)
    // }

    // ---------- Casos intervenidos pero respondiendo lo correcto -------------
    else {
        // const response = fetch(e.request) // (1na forma)
        // const response = fetch(e.request.url) // (Otra forma)
        const response = fetch(ruta) // (3ra forma)
        e.respondWith(response) 
    }

    console.log('');
})