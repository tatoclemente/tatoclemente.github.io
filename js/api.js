// https://mockapi.io/

const apiProducts = (function () {

    function getUrl(id) {
        return 'https://656b4855dac3630cf727f228.mockapi.io/api/products/' + (id || '')
    }
    async function get() {
        const products = await $.ajax({ url: getUrl() })
        return products
    }

    async function post(product) {
        const productAdded = await $.ajax({ url: getUrl(), method: 'post', data: product })
        console.log(productAdded);
    }

    async function put(id, product) {
        const productUpdated = await $.ajax({ url: getUrl(id), method: 'put', data: product })
        console.log(productUpdated);
    }

    async function remove(id) {
        const productoEliminado = await $.ajax({ url: getUrl(id), method: 'delete' })
        console.log(productoEliminado);
    }

    async function removeAll() {

        const progress = $('progress')
        progress.css('display', 'block')

        let percentage = 0
        
        for (let i = 0; i < productList.length; i++) {
            percentage = parseInt((i * 100) / productList.length)

            console.log(percentage + '%');
            progress.val(percentage)

            const { id } = productList[i]

            await remove(id)
        }
        percentage = 100
        console.log(percentage + '%');
        progress.val(percentage)
        
        setTimeout(() => {
            progress.css('display','none')
        }, 100)
  
}

    return {
        get: () => get(),
        post: (product) => post(product),
        put: (id, product) => put(id, product),
        remove: (id) => remove(id),
        removeAll: () => removeAll()
    }

})()