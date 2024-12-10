import { addProductStock, updateMedications } from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  
  const addProductReceived = (e) => {
    e.preventDefault()

    const fields = ['#product-type', '#product', '#new-quantity', '#supplier-info']
    const [type, productName, newQuantity, supplierName] = fields.map((fieldId) => {
      return document.querySelector(fieldId).value
    })

    if (!type || !productName || !newQuantity || !supplierName) {
      window.alert('Invalid values in some fields')
      return
    }
    
    // Update product quantity
    updateProductQuantity(productName, Number(newQuantity))

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
      return
    }

    updateMedications(updatedProductsList)
  }

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})