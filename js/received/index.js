import { addProductStock, updateMedications, getEquipments, getDevices, getDataFromStorage } from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  
  const dataListElement = document.querySelector('#product-list')

  let productType = 'medications'

  const addProductReceived = (e) => {
    e.preventDefault()

    const fields = ['#product-type', '#product', '#new-quantity', '#supplier-info']
    const [type, productName, newQuantity, supplierName] = fields.map((fieldId) => {
      return document.querySelector(fieldId).value
    })

    console.log(type, productName, newQuantity, supplierName)

    if (!type || !productName || !newQuantity || !supplierName) {
      window.alert('Invalid values in some fields')
      return
    }
    
    // Update product quantity
    const isConcluded = updateProductQuantity(productName, Number(newQuantity))
    if (!isConcluded) return

    const data = {
      id: Math.random() * 10,
      type,
      productId: productName,
      quantityAdded: Number(newQuantity),
      supplier: supplierName,
      createdAt: new Date(),
    }

    // Add to local storage
    addProductStock(data)
    window.alert('Receive created!')
  }

  const updateProductQuantity = (name, newQuantity) => {
    // Check if product exists
    const updatedProductsList = medications.map((med) => {
      if (med.name === name) {
        return {
          ...med,
          quantity: Number(med.quantity) + newQuantity
        }
      }

      return med
    })
    if(!updatedProductsList.length) {
      window.alert('Product does not exist')
      return false
    }

    updateMedications(updatedProductsList)
    return true
  }

  const removeProducts = () => {
    dataListElement.innerHTML = ''
  }

  const listProducts = (e) => {
    removeProducts()

    const products = getDataFromStorage(productType)

    products.map((product) => {
      const optionElement = document.createElement('option')
      optionElement.value = product.name
      optionElement.textContent = product.name

      dataListElement.appendChild(optionElement)
    })
  }

  const setProductType = () => {
    const productTypeValue = document.querySelector('#product-type').value
    if(!productTypeValue) return

    productType = productTypeValue

    listProducts()
  }

  const searchProductInput = document.querySelector('#product-list')
  searchProductInput.addEventListener('change', listProducts)

  const typeInput = document.querySelector('#product-type')
  typeInput.addEventListener('change', setProductType)

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})