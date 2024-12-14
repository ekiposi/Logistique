import { addProductTransferred, updateMedications, getMedications, getDataFromStorage, getProductsTransferred } from '../db.js'
import { renderTable } from './table.js'
const { isBefore } = window.dateFns

document.addEventListener('DOMContentLoaded', () => {

  const productSelect = document.querySelector('#product')

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

<<<<<<< HEAD
    // Get current stock before update
    const currentStock = document.getElementById('current-stock').value

=======
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
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
<<<<<<< HEAD
      previousQuantity: Number(currentStock)
=======
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
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

  let productType = 'medications'
  let products = getDataFromStorage(productType)

<<<<<<< HEAD
  const getProductTypeKey = (value) => {
    switch(value) {
      case 'medicament':
        return 'medications';
      case 'equipement':
        return 'equipments';
      case 'appareil':
        return 'devices';
      default:
        return 'medications';
    }
  }

  const listProducts = () => {
    productSelect.innerHTML = '<option value="">Sélectionnez un produit</option>'
    
    products.forEach((product) => {
      const option = document.createElement('option')
      option.value = product.name
      option.textContent = product.name
      productSelect.appendChild(option)
    })
  }

  const onProductTypeChange = () => {
    const productTypeSelect = document.querySelector('#product-type')
    const productTypeValue = productTypeSelect.value
    if(!productTypeValue) return

    // Update global productType and products
    productType = getProductTypeKey(productTypeValue)
    products = getDataFromStorage(productType)

    // Reset current stock and product selection
    const currentStockElement = document.querySelector('#current-stock')
    currentStockElement.value = ''
    
    // Update product list
=======
  const onProductTypeChange = () => {
    const productTypeValue = document.querySelector('#product-type').value
    if(!productTypeValue) return

    // Update global productType global var
    productType = productTypeValue
    products = getDataFromStorage(productTypeValue)


    const currentStockElement = document.querySelector('#current-stock')
    currentStockElement.textContent = 

>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
    listProducts()
  }

  const addProductReceived = (e) => {
    e.preventDefault()

    const fields = ['#product-type', '#product', '#data-tranferenc', '#transfer-quantity', '#transfer-reason' ]
    const [type, productName, tranferenceDate, quantityTransferred, reason] = fields.map((fieldId) => {
      return document.querySelector(fieldId).value
    })

    if (!type || !productName || !quantityTransferred || !tranferenceDate || !reason) {
      window.alert('Invalid values in some fields')
      return
    }
  
    if (!selectedProduct) {
      window.alert('Product not found!')
      return 
    }

    const data = {
      id: Math.floor(Math.random() * 1000000),
      type,
      productId: productName,
      quantityTransferred: Number(quantityTransferred),
      newQuantity: Number(quantityTransferred) + selectedProduct.quantity,
      reason,
      previousQuantity: selectedProduct.quantity,
      tranferenceDate,
      createdAt: new Date(),
    }

    // Check if product is expired
    const isExpired = isBefore(new Date(selectedProduct.expirationDate), new Date())
    if(isExpired) {
      window.alert('Selected product is expired.')
      return
    }

    // Update product quantity
    const isConcluded = updateProductQuantity(productName, Number(quantityTransferred))
    if (!isConcluded) return

    // Add to local storage
    addProductTransferred(data)

    const updatedStock = getProductsTransferred()
    console.log(updatedStock)
    renderTable(updatedStock)
    window.alert('Transfer created!')
  }

<<<<<<< HEAD
=======
  const listProducts = () => {
    // removeProductsList()

    products.map((product) => {
      const optionElement = document.createElement('option')
      optionElement.value = product.name
      optionElement.textContent = product.name

      productSelect.append(optionElement)
    })
  }
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
  let selectedProduct = {}
  const onProductSelect = (e) => {
    const currentStockElement = document.querySelector('#current-stock')

    const productName = e.target.value
    if (!productName) {
      selectedProduct = {}
      currentStockElement.value = 0
      return
    }

    selectedProduct = products.find((prod) => prod.name === productName)

    currentStockElement.value = selectedProduct.quantity
  }

  listProducts()

  productSelect.addEventListener('change', onProductSelect)

  const typeInput = document.querySelector('#report-product-type')
  typeInput.addEventListener('change', (e) => onProductTypeChange(e))

<<<<<<< HEAD
  const productTypeSelect = document.querySelector('#product-type')
  productTypeSelect.addEventListener('change', onProductTypeChange)

  const transferQuantityForm = document.querySelector('#transfer-quantity-form')
  transferQuantityForm.addEventListener('submit', createTransfer)
=======
  const transferQuantityForm = document.querySelector('#transfer-quantity-form')
  transferQuantityForm.addEventListener('submit', createTransfer)


  const addReceivedQuantity = document.querySelector('#transfer-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
})
