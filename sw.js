
const CACHE_STATIC_NAME = 'static-v08'
const CACHE_INMUTABLE_NAME = 'inmutable-v08'
const CACHE_DYNAMIC_NAME = 'dynamic-v09'

const CON_CACHE = true
//Eventos Clásicos
self.addEventListener('install', e => {
  console.log('Installed');

  // skip waiting automatico

  self.skipWaiting()

  const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
    console.log('Cache: ', cache);

    //  Guardo todos los recursos de la APP SHELL (son los necesarios para que la web sea funcional)
    return cache.addAll([
      '/index.html',
      '/css/styles.css',
      '/js/main.js',
      '/images/img-superlista.jpeg',
      '/js/api.js',
      '/templates/productos.hbs'
    ])

  })
  const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
    //console.log(cache)

    // Guardo todos los recursos de la APP SHELL (son los necesarios para que la web sea funcional)
    return cache.addAll([
      'https://code.jquery.com/jquery-3.7.1.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js',
      'https://code.getmdl.io/1.3.0/material.min.js',
      'https://code.getmdl.io/1.3.0/material.teal-orange.min.css'
    ])
  })

  // Espero a que todas las promesas de este listener se cumplan
  // e.waitUntil(cacheStatic)
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})


self.addEventListener('activate', e => {
  console.log('activate')

  const cacheWhiteList = [
    CACHE_STATIC_NAME,
    CACHE_INMUTABLE_NAME,
    CACHE_DYNAMIC_NAME
  ]

  // Borro todos los caches que NO están en la lista actual (borro los caches viejos)
  const cachesBorrados = caches.keys().then(nombres => {
    return Promise.all(
      nombres.map(nombre => {
        if (!cacheWhiteList.includes(nombre)) {
          return caches.delete(nombre)
        }
      }
      ))
  })

  e.waitUntil(cachesBorrados)
})

self.addEventListener('fetch', e => {
  //console.log('fetch!!!')

  if (CON_CACHE) {
    const { url, method } = e.request
    //console.log(method,url)

    if (method == 'GET' && !url.includes('mockapi.io')) {
      const respuesta = caches.match(e.request).then(res => {
        if (res) {
          console.log('EXISTE: el recurso en el cache', url)
          return res
        }
        console.error('NO EXISTE: el recurso no existe en el cache', url)

        return fetch(e.request).then(nuevaRespuesta => {
          caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            cache.put(e.request, nuevaRespuesta)
          })
          return nuevaRespuesta.clone()
        })
      }).catch(err => {
        console.log('Error al guardar el recurso en el cache', err)
      })
      e.respondWith(respuesta)
    }
    else {
      console.warn('BYPASS', method, url)
    }
  }
})