import { addProductTransferred, updateMedications, getMedications } from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const createTransfer = (e) => {
    e.preventDefault()

    const fields = [
      { id: 'type', value: '#product-type'},
      { id: 'productName', value: '#product' },
      { id: 'transferQuantity', value: '#transfer-quantity'},
      { id: 'reason', value: '#transfer-reason'}
    ]
    const fieldsValues = fields.reduce((acc, item) => {
      const value = document.querySelector(item.value).value
      acc[item.id] = value
      return acc
    }, {})

    // Update product quantity
    const isConcluded = updateProductQuantity(fieldsValues.productName, Number(fieldsValues.transferQuantity))
    if(!isConcluded) return

    const data = {
      id: Math.floor(Math.random() * 1000000),
      type: fieldsValues.type,
      productId: fieldsValues.productName,
      quantityTransferred: Number(fieldsValues.transferQuantity),
      reason: fieldsValues.reason,
      createdAt: new Date(),
    }

    addProductTransferred(data)
    window.alert('Transfer concluded!')
  }

  const updateProductQuantity = (name, newQuantity) => {
    const medications = getMedications()

    // Check if product exists
    const productExist = medications.find(med => med.name === name)
    if(!productExist) {
      window.alert('Product does not exist')
      return false
    }

    const updatedQuantity = Number(productExist.quantity) - newQuantity
    if(updatedQuantity < 0) {
      window.alert('Insufficient quantity to be transferred.')
      return false
    }

    const updatedProductsList = medications.map(med => {
      if(med.name !== name) return med

      return {
        ...productExist,
        quantity: updatedQuantity
      }
    })

    updateMedications(updatedProductsList)

    return true
  }

  const transferQuantityForm = document.querySelector('#transfer-quantity-form')
  transferQuantityForm.addEventListener('submit', createTransfer)
})
