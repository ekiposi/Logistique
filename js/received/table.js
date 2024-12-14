import { formatDate, capitalize } from '../utils.js'
import { getDataFromStorage, getProductsStock } from '../db.js'
const { isAfter, isBefore, isSameDay, endOfDay, startOfDay, addMinutes } = window.dateFns

const productsReceivedTableBody = document.querySelector('#products-received-table tbody');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const productTypeFilter = document.getElementById('report-product-type');

const products = getDataFromStorage(productTypeFilter.value)

<<<<<<< HEAD
=======
const receivedFormContainer = document.querySelector('#received-form')

const showReceivedForm = (index = -1) => {
  // Toggle visibility
  receivedFormContainer.classList.toggle("hidden");
  
  // If already visible, hide and return
  if (receivedFormContainer.classList.contains("hidden")) {
      return;
  }
  
  formTitle.innerText = "Modifier un appareil médical";
  const device = products[index];
  document.getElementById("name").value = device.name || '';
  document.getElementById("quantity").value = device.quantity || '';
  document.getElementById("date").value = device.createdAt || new Date().toISOString().split('T')[0];
  document.getElementById("function").value = device.role || '';
  document.getElementById("type").value = device.type || '';
  document.getElementById("info").value = device.additionalInfo || '';
  editingIndex = index;
};

>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
export const renderTable = (data) => {
  const receivedProducts = data || getProductsStock()

  productsReceivedTableBody.innerHTML = ''

  if (receivedProducts.length === 0) {
    productsReceivedTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Aucune donnée disponible</td></tr>';
    return;
  }

<<<<<<< HEAD
  receivedProducts.forEach((receivedProduct) => {
=======
  receivedProducts.forEach((receivedProduct, index) => {
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
    const product = products.find((item) => item.name === receivedProduct.productId)
    if(!product) return

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${formatDate(receivedProduct.receptionDate)}</td>
      <td>${receivedProduct.role}</td>
      <td>${capitalize(receivedProduct.type)}</td>
      <td>${product.quantity < 4 ? 'Oui' : 'Non'}</td>
      <td>${receivedProduct.information}</td>
      <td>${receivedProduct.previousQuantity}</td>
      <td>${receivedProduct.quantityAdded}</td>
      <td>${receivedProduct.newQuantity}</td>
      <td class="flex gap-2.5 border-none">
<<<<<<< HEAD
        <img src="../../images/icons/edit.png" alt="" class="w-7 h-7 cursor-pointer" />
        <img src="../../images/icons/trash.png" alt="" class="w-7 h-7 cursor-pointer" />
=======
        <button onclick="showReceivedForm(${index})" class="text-black py-1 px-2 rounded-lg mr-2 cursor-pointer">Modifier</button>
        <button onclick="deleteDevice(${index})" class="text-black py-1 px-2 rounded-lg cursor-pointer">Supprimer</button>
>>>>>>> 0ed9499a2af5648586dea5ca2f414cc885591eee
      </td>
    `;
    productsReceivedTableBody.appendChild(row);
  });

  const filterData = () => {
    const startDate = startDateInput.value ? startOfDay(startDateInput.value) : null;
    const endDate = endDateInput.value ? addMinutes(endOfDay(endDateInput.value), 1) : null;
    const filter = productTypeFilter.value;

    const receivedProducts = getProductsStock()
    const filteredData = receivedProducts.filter((receivedProduct) => {
        const receivedDate = startOfDay(new Date(receivedProduct.receptionDate));

        // Date filters
        const isWithinStartDate = startDate ? isAfter(receivedDate, startDate) || isSameDay(receivedDate, startDate) : true;
        const isWithinEndDate = endDate ? isBefore(receivedDate, endDate) || isSameDay(receivedDate, endDate) : true;

        // Type filters
        const matchesFilter = 
          filter === 'medications' ? receivedProduct.type === 'medications' :
          filter === 'equipments' ? receivedProduct.type === 'equipments' :
          filter === 'devices' ? receivedProduct.type === 'devices' :
          true;

        return isWithinStartDate && isWithinEndDate && matchesFilter;
    });

    renderTable(filteredData);
  };

  const filterButton = document.querySelector('#filter-button')
  filterButton.addEventListener('click', filterData)
}

renderTable()