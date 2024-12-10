document.addEventListener('DOMContentLoaded', () => {
  const productsStock = JSON.parse(localStorage.getItem('products_stock')) || []
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  
  const addProductReceived = (e) => {
    e.preventDefault()

    const fields = ['#product-type', '#product', '#new-quantity', '#supplier-info']
    const [type, productName, newQuantity, supplierName] = fields.map((fieldId) => {
      return document.querySelector(fieldId).value
    })
    
    // Update product quantity
    updateProductQuantity(productName)

    const data = {
      id: Math.random() * 10,
      type,
      productId: productName,
      quantityAdded: Number(newQuantity),
      supplier: supplierName,
      createdAt: new Date(),
    }

    const updatedProductsStock = JSON.stringify([...productsStock, data])

    // Add to local storage
    localStorage.setItem('products_stock', updatedProductsStock)
    window.alert('Receive created!')

    console.log('added to local storage')
  }

  const updateProductQuantity = (name) => {
    // Check if product exists
    const productExists = medications.map((med) => {
      if (med.name === name) {
        return {
          ...med,
          quantity: Number(med.quantity) + newQuantity
        }
      }

      return med
    })
    if(!productExists.length) {
      window.alert('Product does not exist')
      return
    }
  }

  console.log('working')

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})