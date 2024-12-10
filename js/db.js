// RECEIVED PRODUCTS

export const getProductsStock = () => {
  const productsStock = JSON.parse(localStorage.getItem('products_stock')) || []
  return productsStock
}

export const addProductStock = (data) => {
  const previousData = getProductsStock()

  const updatedData = JSON.stringify([...previousData, data])
  localStorage.setItem('products_stock', updatedData)
}

// TRANSFERRED PRODUCTS

export const getProductsTransferred = () => {
  const productsTransferred = JSON.parse(localStorage.getItem('products_transferred')) || []
  return productsTransferred
}

export const addProductTransferred = (data) => {
  const previousData = getProductsTransferred()

  const updatedData = JSON.stringify([...previousData, data])
  localStorage.setItem('products_transferred', updatedData)
}

// MEDICATIONS

export const getMedications = () => {
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  return medications
}

export const updateMedications = (data) => {
  const updatedData = JSON.stringify(data)
  localStorage.setItem('medications', updatedData)
}
