const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const slider = document.querySelectorAll('.slide')
const conteiner = document.querySelector('.header')

// slider for main 

conteiner.addEventListener('click', (e) => {
    clearActivaClass()
    e.target.classList.add('active_flex')
    console.log(e.target)
})

function clearActivaClass() {
    slider.forEach(element => {
        element.classList.remove('active_flex')
        console.log(element)
    })
} 

const CARD_HTML = document.querySelector('#card')
CARD_HTML.addEventListener('click', (e) => {
    e.preventDefault()

    if (e.target.classList.contains('js-remove')) {
        const id = e.target.dataset.id
        fetch(`/card/remove/${id}`, { method: 'delete' }).then(response => response.json()).then(result => {
            console.log(result)
            if (result.courses.length) {
                const html = result.courses.map(c => {
                    return `
                    <tr>
                    <td>${c.title}</td>
                    <td id="count">${c.count}</td>
                    <td class="price total-table__price">${toCurrency(c.price)}</td>
                    <td>
                        <button class="btn-floating btn-small waves-effect waves-light red js-remove js-remove material-icons" data-id="${c.id}">remove</button>
                    </td>
                    </tr>
                    `
                }).join('')
                CARD_HTML.querySelector('tbody').innerHTML = html
                document.querySelector('#total-price').textContent = toCurrency(result.total)
            } else {
                CARD_HTML.innerHTML = `<p>Корзина пуста</p>`
            }
        })
    }
})



