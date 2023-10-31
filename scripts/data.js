import {MENU_JSON_BIN_ID, BASE_URL, MASTER_KEY, SHOPPING_CART_BIN_ID} from './const.js'

export async function getMenu () {
  try{
    //example url: https://api.jsonbin.io/v3/b/653631d754105e766fc5dfd2
    const response = await axios.get(`${BASE_URL}/b/${MENU_JSON_BIN_ID}/latest`, {headers: {
      "X-Master-Key": MASTER_KEY
    }})
    return response.data.record
  } catch(error) {
    throw new Error(error)
  }
}

export async function getShoppingCartList() {
  try{
    const response = await axios.get(`${BASE_URL}/b/${SHOPPING_CART_BIN_ID}/latest`, {headers: {
      "X-Master-Key": MASTER_KEY
    }})
    if (response.data && response.data.record) {
      return response.data.record
    } else {
      return []
    }
    
  } catch(error) {
    throw new Error(error)
  }
}

export async function createShoppingCart (data) {
  try{
    let cartList = await getShoppingCartList()
    
    if(cartList.length > 0){
      let params
      const cartListID = cartList.map((x) => x.id)
      if (cartListID.includes(data.id)) {
        params = cartList.map((x) => {
          if (x.id === data.id) {
            x.quantity = x.quantity + 1
          }
          return x
        })
      } else {
        cartList.push(data)
        params = cartList
      }
      await axios.put(`${BASE_URL}/b/${SHOPPING_CART_BIN_ID}`, params, {headers: {
        "X-Master-Key": MASTER_KEY,
        "Content-Type": "application/json"
      }})
    }
    
  } catch(error) {
    throw new Error(error)
  }
}

export async function updateShoppingCart (cartList, data) {
  try{
    const params = cartList.map((x) => {
      if (x.id === data.id) {
        x = data
      }
      return x
    })
    await axios.put(`${BASE_URL}/b/${SHOPPING_CART_BIN_ID}`, params, {headers: {
      "X-Master-Key": MASTER_KEY,
      "Content-Type": "application/json"
    }})
  } catch(error) {
    throw new Error(error)
  }
}


export async function deleteShoppingCart(cartList, id, key) {
  try{
    if (cartList.length > 0) {
      let params
      if (key === 'delete') {
        params = cartList.filter((x) => x.id !== id)
      } else {
        params = cartList.map((x) => {
          if (x.quantity > 1 && x.id === id) {
            x.quantity = x.quantity - 1
          }
          return x
        })
      }
      await axios.put(`${BASE_URL}/b/${SHOPPING_CART_BIN_ID}`, params, {headers: {
        "X-Master-Key": MASTER_KEY,
        "Content-Type": "application/json"
      }})
    }
  }catch(error) {
    throw new Error(error)
  }
}