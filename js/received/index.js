<<<<<<< HEAD
import { addProductStock, updateMedications, getEquipments, getDevices, getDataFromStorage, getProductsStock } from '../db.js'
import { formatDate } from '../utils.js'
import { renderTable } from './table.js'
const { isBefore } = window.dateFns

document.addEventListener('DOMContentLoaded', () => {
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  
  const productSelect = document.querySelector('#product')

  let productType = 'medications'

  // Selected product in select input
  let products = getDataFromStorage(productType)
=======
import { addProductStock, updateMedications, getDataFromStorage, getProductsStock } from '../db.js'
import { renderTable } from './table.js'
const { isBefore } = window.dateFns

var productType = 'medications'
var products = getDataFromStorage(productType)

const productSelect = document.querySelector('#product')

const removeProductsList = () => {
  productSelect.innerHTML = '<option value="">Sélectionnez un produit</option>'
}

const listProducts = () => {
  removeProductsList()

  products.map((product) => {
    const optionElement = document.createElement('option')
    optionElement.value = product.name
    optionElement.textContent = product.name

    productSelect.append(optionElement)
  })
}

const onProductTypeChange = (elementId) => {
  const productTypeValue = document.querySelector(elementId).value
  if(!productTypeValue) return

  // Update global productType global var
  productType = productTypeValue
  products = getDataFromStorage(productTypeValue)


  const currentStockElement = document.querySelector('#current-stock')
  currentStockElement.textContent = 

  listProducts()
}

document.addEventListener('DOMContentLoaded', () => {
  const medications = JSON.parse(localStorage.getItem('medications')) || []
  
  // Selected product in select input
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
  let selectedProduct = {}

  const addProductReceived = (e) => {
    e.preventDefault()

    const fields = ['#product-type', '#product', '#new-quantity', '#supplier-info', '#fonction', '#extra-information', '#reception-date']
    const [type, productName, newQuantity, supplierName, role, information, receptionDate] = fields.map((fieldId) => {
      return document.querySelector(fieldId).value
    })

    if (!type || !productName || !newQuantity || !supplierName || !role || !receptionDate) {
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
      quantityAdded: Number(newQuantity),
      newQuantity: Number(newQuantity) + selectedProduct.quantity,
      supplier: supplierName,
      role,
      information,
      previousQuantity: selectedProduct.quantity,
      receptionDate,
      createdAt: new Date(),
    }

    // Check if product is expired
    const isExpired = isBefore(new Date(selectedProduct.expirationDate), new Date())
    if(isExpired) {
      window.alert('Selected product is expired.')
      return
    }

    // Update product quantity
    const isConcluded = updateProductQuantity(productName, Number(newQuantity))
    if (!isConcluded) return

    // Add to local storage
    addProductStock(data)

<<<<<<< HEAD
    const updatedStock = getProductsStock()
    renderTable(updatedStock)
    window.alert('Receive created!')
  }

=======
    renderTable()
    window.alert('Receive created!')
  }

  const editProduct = () => {
    const fields = [
      { id: 'type', value: '#product-type-edit'},
      { id: 'productName', value: '#product-edit' },
      { id: 'receptionDate', value: '#reception-date-edit' },
      { id: 'information', value: '#extra-information-edit' },
      { id: 'newQuantity', value: '#new-quantity-edit'},
      { id: 'role', value: '#fonction-edit'},
      { id: 'supplier', value: '#supplier-info-edit'}
    ]
    const fieldsValues = fields.reduce((acc, item) => {
      const value = document.querySelector(item.value).value
      acc[item.id] = value
      return acc
    }, {})
  
    const data = {
      id: Math.floor(Math.random() * 1000000),
      type: fieldsValues.type,
      productId: fieldsValues.productName,
      quantityAdded: Number(newQuantity),
      newQuantity: Number(newQuantity) + selectedProduct.quantity,
      supplier: supplierName,
      role,
      information,
      previousQuantity: selectedProduct.quantity,
      receptionDate,
      createdAt: new Date(),
    }
  }

>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
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

<<<<<<< HEAD
  const removeProductsList = () => {
    productSelect.innerHTML = '<option value="">Sélectionnez un produit</option>'
  }

  const listProducts = () => {
    removeProductsList()

    products.map((product) => {
      const optionElement = document.createElement('option')
      optionElement.value = product.name
      optionElement.textContent = product.name

      productSelect.append(optionElement)
    })
  }

  const onProductTypeChange = () => {
    const productTypeValue = document.querySelector('#product-type').value
    if(!productTypeValue) return

    // Update global productType global var
    productType = productTypeValue
    products = getDataFromStorage(productTypeValue)


    const currentStockElement = document.querySelector('#current-stock')
    currentStockElement.textContent = 

    listProducts()
  }
=======

>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee

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

  const typeInput = document.querySelector('#product-type')
<<<<<<< HEAD
  typeInput.addEventListener('change', (e) => onProductTypeChange(e))

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})
=======
  typeInput.addEventListener('change', (e) => onProductTypeChange('#product-type'))

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})

const showReceivedForm = (index) => {
  listProducts()

  const formContainer = document.querySelector(`#received-form`)
  formContainer.classList.toggle('hidden')

  const fields = [
    { id: 'type', value: '#product-type-edit'},
    { id: 'productId', value: '#product-edit' },
    { id: 'receptionDate', value: '#reception-date-edit' },
    { id: 'information', value: '#extra-information-edit' },
    { id: 'newQuantity', value: '#new-quantity-edit'},
    { id: 'role', value: '#fonction-edit'},
    { id: 'supplier', value: '#supplier-info-edit'}
  ]

  const receivedProducts = getProductsStock()
  const product = receivedProducts[index] 

  // Set input values
  fields.forEach((item) => {
    const element = document.querySelector(item.value)
    if (item.id === 'type' || item.id === 'productId') {
      element.value = product[item.id]
      return
    }


    element.value = product[item.id] || ''
    element.textContent = product[item.id] || ''
  })
}

window.showReceivedForm = showReceivedForm

// Edit event listeners
const editTypeInput = document.querySelector('#edit-product-type')
editTypeInput.addEventListener('change', (e) => onProductTypeChange('#edit-product-type'))
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
