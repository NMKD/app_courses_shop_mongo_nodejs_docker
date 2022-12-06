const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const slider = document.querySelectorAll('.slide')
const container = document.querySelector('.header')

// slider for main 
if (container) {
    container.addEventListener('click', (e) => {
        clearActivaClass()
        e.target.classList.add('active_flex')
    })
}


function clearActivaClass() {
    slider.forEach(element => {
        element.classList.remove('active_flex')
        console.log(element)
    })
}

if (document.querySelectorAll('.tabs')) {
    var instance = M.Tabs.init(document.querySelectorAll('.tabs'));
}

const CARD_HTML = document.querySelector('#card')
CARD_HTML.addEventListener('click', (e) => {
    e.preventDefault()

    if (e.target.classList.contains('js-remove')) {
        const id = e.target.dataset.id
        fetch(`/card/remove/${id}`, { method: 'delete' }).then(response => response.json()).then(result => {
            // console.log(e.target)
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

