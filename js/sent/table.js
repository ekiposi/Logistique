import { formatDate, capitalize } from '../utils.js'
import { getDataFromStorage, getProductsTransferred } from '../db.js'
const { isBefore, isAfter ,isSameDay, endOfDay, startOfDay, addMinutes } = window.dateFns

const productsReceivedTableBody = document.querySelector('#products-received-table tbody');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const productTypeFilter = document.getElementById('report-product-type');

const products = getDataFromStorage(productTypeFilter.value)
console.log(productTypeFilter)
export const renderTable = (data) => {
  const productsTransferred = data || getProductsTransferred()
  productsReceivedTableBody.innerHTML = ''

  if (productsTransferred.length === 0) {
    productsReceivedTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Aucune donnée disponible</td></tr>';
    return;
  }
  console.log(products)

  productsTransferred.forEach((tranferedProduct) => {
    const product = products.find((item) => item.name === tranferedProduct.productId)
    if(!product) return
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${formatDate(tranferedProduct.createdAt)}</td>
      <td>Fonction</td>
      <td>${capitalize(tranferedProduct.type)}</td>
      <td>${product.quantity < 4 ? 'Oui' : 'Non'}</td>
      <td>${tranferedProduct.reason}</td>
      <td>${tranferedProduct.previousQuantity}</td>
      <td>${tranferedProduct.quantityTransferred}</td>
      <td>${tranferedProduct.previousQuantity - tranferedProduct.quantityTransferred}</td>
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
    console.log(filter)

    const productsTransferred = getProductsTransferred()
    const filteredData = productsTransferred.filter((tranferedProduct) => {
        const receivedDate = startOfDay(new Date(tranferedProduct.receptionDate));

        // Date filters
        const isWithinStartDate = startDate ? isAfter(receivedDate, startDate) || isSameDay(receivedDate, startDate) : true;
        const isWithinEndDate = endDate ? isBefore(receivedDate, endDate) || isSameDay(receivedDate, endDate) : true;

        // Type filters
        const matchesFilter = 
          filter === 'medications' ? tranferedProduct.type === 'medications' :
          filter === 'equipments' ? tranferedProduct.type === 'equipments' :
          filter === 'devices' ? tranferedProduct.type === 'devices' :
          true;

        return isWithinStartDate && isWithinEndDate && matchesFilter;
    });

    renderTable(filteredData);
  };

  const filterButton = document.querySelector('#filter-button')
  filterButton.addEventListener('click', filterData)
}

renderTable()