// UTIL

export const getDataFromStorage = (table) => {
  const data = JSON.parse(localStorage.getItem(table)) || []
  return data
}

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

// EQUIPMENTS

export const getEquipments = () => {
  const equipments = JSON.parse(localStorage.getItem('equipments')) || []
  return equipments
}

export const addEquipment = (data) => {
  const previousData = getEquipments()

  const updatedData = JSON.stringify([...previousData, data])
  localStorage.setItem('equipments', updatedData)
}

export const updateEquipments = (data) => {
  const updatedData = JSON.stringify(data)
  localStorage.setItem('equipments', updatedData)
}

// DEVICES

export const getDevices = () => {
  const devices = JSON.parse(localStorage.getItem('devices')) || []
  return devices
}

export const addDevice = (data) => {
  const previousData = getDevices()

  const updatedData = JSON.stringify([...previousData, data])
  localStorage.setItem('devices', updatedData)
}

export const updateDevices = (data) => {
  const updatedData = JSON.stringify(data)
  localStorage.setItem('devices', updatedData)
}

// UPDATE PROFILE

export const updateProfile = (data) => {
  const updatedData = JSON.stringify(data)
  localStorage.setItem('profile', updatedData)
}