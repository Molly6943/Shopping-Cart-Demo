import {getMenu, getShoppingCartList, createShoppingCart, updateShoppingCart, deleteShoppingCart} from './data.js'
const DELEVERY_FEE_CENTS = 489
const PLATFORM_FEE_CENTS = 40
const TAX_RATE = 0.08

async function renderMenu() {
    const menuListElement = document.querySelector('.menu-list')
    const menuList = await getMenu()
    if (menuList.length > 0) {
        menuList.forEach((item) => {
          const listItem = document.createElement('div')
          listItem.classList = "card mb-3 me-3"
          listItem.innerHTML = 
            `<div class="row g-0 d-flex align-items-center">
                  <div class="col-md-8">
                      <div class="card-body">
                          <h6 class="card-title">${item.name}</h6>
                          <p class="card-text">
                              <small class="text-muted">${item.desc}</small>
                          </p>
                          <p class="card-text">
                              S$ ${ (item.priceCents / 100).toFixed(2)}
                          </p>
                      </div>
                  </div>
                  <div class="col-md-4 pe-2">
                      <img
                          src="${item.image}"
                          class="img-fluid rounded"
                          alt="...">
                  </div>
              </div>
              <div class="add-to-card">
                  <i class="fa-solid fa-plus"></i>
              </div>`

            listItem.querySelector('.add-to-card').addEventListener('click', async () => {
              const params = Object.assign(item, {quantity: 1})
              await createShoppingCart(params)
              renderShoppingCart()
            })
            menuListElement.appendChild(listItem);
      });
    }
}

async function renderShoppingCart () {
  const cartListElement = document.querySelector('.cart-list')
  cartListElement.innerHTML = ""
  const cartList = await getShoppingCartList()
  const subTotalCents = cartList.map(x => x.priceCents * x.quantity).reduce((total, currentValue) => total += currentValue)
  const taxCents = subTotalCents * TAX_RATE
  const totalCents = subTotalCents + DELEVERY_FEE_CENTS + PLATFORM_FEE_CENTS + taxCents

  if (cartList.length > 0) {
    cartList.forEach((item) => {
      const listItem = document.createElement('div')
      listItem.classList = 'cart-item'
      listItem.innerHTML = `
        <div class="cart-item-img">
            <img
                src="${item.image}"
                class="img-fluid rounded"
                alt="...">
        </div>
        <h6 class="red cart-title">${item.name}</h6>
        <div>
            <div>
                <p>
                  <small class="text-muted">S$ ${ (item.priceCents / 100).toFixed(2)}</small>
                </p>
                <div class="quantity">
                  <span id="delete-cart">
                    ${item.quantity > 1 ? `<i class="fa-solid fa-minus red"></i>`: `<i class="fa-regular fa-trash-can red"></i>`}
                  </span>
                    <input disabled="disabled" value="${item.quantity}"/>
                    <span id="add-cart">
                      <i class="fa-solid fa-plus red"></i>
                    </span>
                </div>
            </div>
        </div>`
      listItem.addEventListener('mouseover', () =>{
        const quantityElement = listItem.querySelector('.quantity')
        quantityElement.classList = 'quantity quantity-mouseover'
      })
      listItem.addEventListener('mouseout', () =>{
        const quantityElement = listItem.querySelector('.quantity')
        quantityElement.classList = 'quantity'
      })
      listItem.querySelector('#delete-cart').addEventListener('click', async () => {
        const key = item.quantity > 1 ? 'updateQuantity' : 'delete'
        await deleteShoppingCart(cartList, item.id, key)
        renderShoppingCart()
      })
      listItem.querySelector('#add-cart').addEventListener('click', async () => {
        const params = Object.assign(item, {quantity: item.quantity+1})
        await updateShoppingCart(cartList, params)
        renderShoppingCart()
      })
      cartListElement.appendChild(listItem);
    })
  }

  document.querySelector('#subtotal').innerHTML = `S$ ${(subTotalCents/100).toFixed(2)}`
  document.querySelector('#total').innerHTML = `S$ ${(totalCents/100).toFixed(2)}`
}

document.querySelector('#payment').addEventListener('click', () => {
  alert('Your order has been successfully placed!')
})

renderMenu()

renderShoppingCart()