const prodBtns = document.querySelectorAll('.prod-menu button')
const prodList = document.querySelectorAll('.prod-item')

const products = document.querySelector('.products')
const filter = document.getElementById('filter')

const listItems = []

// filter product
prodBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const type = e.target.getAttribute('type-prod')

        // remove and set active fpr button
        document
            .querySelector('.prod-menu button.active')
            .classList.remove('active')
        e.target.classList.add('active')

        // filter elements
        prodList.forEach((item) => {
            if (type == 'all' || item.getAttribute('type-prod') == type)
                item.classList.remove('hide')
            else item.classList.add('hide')
        })
    })
})

getData()

filter.addEventListener('input', (e) => filterData(e.target.value))

async function getData() {
    const res = await fetch('https://624a7fc9852fe6ebf887cd97.mockapi.io/api/nvt_1/list-items')

    const results = await res.json()

    // Clear products
    if (!listItems == null) products.innerHTML = listItems
    else products.innerHTML = ''

    results.forEach((product) => {
        const div = document.createElement('div')
        div.setAttribute('class', 'product-item')
        listItems.push(div)

        div.innerHTML = `
			<img src="${product.image}">
			<div class="product-detail">
				<h4>${product.title.slice(0, 50)}</h4>
				<p>${product.price}</p>
			</div>
        `
        products.appendChild(div)
    })
}

// Filter data
function filterData(search) {
    listItems.forEach((it) => {
        if (it.innerText.toLowerCase().includes(search.toLowerCase())) {
            it.classList.remove('hide')
        } else {
            it.classList.add('hide')
        }
    })
}