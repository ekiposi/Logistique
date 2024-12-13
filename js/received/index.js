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

    const updatedStock = getProductsStock()
    renderTable(updatedStock)
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
  typeInput.addEventListener('change', (e) => onProductTypeChange(e))

  const addReceivedQuantity = document.querySelector('#add-quantity-form')
  addReceivedQuantity.addEventListener('submit', addProductReceived)
})