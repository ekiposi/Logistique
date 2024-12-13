import { formatDate, capitalize } from '../utils.js'
import { getDataFromStorage, getProductsStock } from '../db.js'
const { isAfter, isBefore, isSameDay, endOfDay, startOfDay, addMinutes } = window.dateFns

const productsReceivedTableBody = document.querySelector('#products-received-table tbody');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const productTypeFilter = document.getElementById('report-product-type');

const products = getDataFromStorage(productTypeFilter.value)

export const renderTable = (data) => {
  const receivedProducts = data || getProductsStock()

  productsReceivedTableBody.innerHTML = ''

  if (receivedProducts.length === 0) {
    productsReceivedTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Aucune donnée disponible</td></tr>';
    return;
  }

  receivedProducts.forEach((receivedProduct) => {
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
        <img src="../../images/icons/edit.png" alt="" class="w-7 h-7 cursor-pointer" />
        <img src="../../images/icons/trash.png" alt="" class="w-7 h-7 cursor-pointer" />
      </td>
    `;
    productsReceivedTableBody.appendChild(row);
  });

  const filterData = () => {
    const startDate = startDateInput.value ? startOfDay(startDateInput.value) : null;
    const endDate = endDateInput.value ? addMinutes(endOfDay(endDateInput.value), 1) : null;
    const filter = productTypeFilter.value;

    const filteredData = products.filter((receivedProduct) => {
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

        console.log({isWithinStartDate, isWithinEndDate, matchesFilter})

        return isWithinStartDate && isWithinEndDate && matchesFilter;
    });

    renderTable(filteredData);
  };

  const filterButton = document.querySelector('#filter-button')
  filterButton.addEventListener('click', filterData)
}

renderTable()