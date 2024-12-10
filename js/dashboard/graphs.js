import { getProductsStock, getProductsTransferred } from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const { isSameMonth } = window.dateFns

  const buildPieChart = (data, element) => {
    const config = {
      type: 'pie',
      data: data,
    };

    new Chart(
      element,
      config
    )
  }

  const transferredQuantityChart = () => {
    const productsTransferred = getProductsTransferred()

    const currentMonthTransferredQuantity = productsTransferred.reduce((acc, product) => {
      const sameMonth = isSameMonth(product.createdAt, new Date())
      if (!sameMonth) return

      return product.quantityTransferred + acc
    }, 0) || 0

    const lastMonthTransferredQuantity = productsTransferred.reduce((acc, product) => {
      const sameMonth = isSameMonth(product.createdAt, new Date())
      if (sameMonth) return

      return product.quantityTransferred + acc
    }, 0) || 0

    const percentageDifference = calculateMonthPercentual(lastMonthTransferredQuantity, currentMonthTransferredQuantity)

    // Set percentual value to html element
    const percentualElement = document.querySelector('#transferred-percentual')
    if (percentageDifference > 0) {
      percentualElement.classList.add('text-green-500')
      percentualElement.textContent = `+${percentageDifference}%`
    } else {
      percentualElement.classList.add('text-red-500')
      percentualElement.textContent = `-${percentageDifference}%`
    }

    const data = {
      labels: [
        'Current month',
        'Last month',
      ],
      datasets: [{
        label: 'Total',
        data: [currentMonthTransferredQuantity, lastMonthTransferredQuantity],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
        ],
        hoverOffset: 4
      }]
    };

    const chartContainer = document.getElementById('transferred-quantity')
    buildPieChart(data, chartContainer)
  }

  const receivedQuantityChart = () => {
    const productsStock = getProductsStock()

    const lastMonthReceivedQuantity = productsStock.reduce((acc, product) => {
      const sameMonth = isSameMonth(product.createdAt, new Date())
      if (sameMonth) return

      return product.quantityAdded + acc
    }, 0) || 0

    const currentMonthReceivedQuantity = productsStock.reduce((acc, product) => {
      const sameMonth = isSameMonth(product.createdAt, new Date())
      if (!sameMonth) return

      return product.quantityAdded + acc
    }, 0)

    const percentageDifference = calculateMonthPercentual(lastMonthReceivedQuantity, currentMonthReceivedQuantity)

    // Set percentual value to html element
    const percentualElement = document.querySelector('#received-percentual')
    if (percentageDifference > 0) {
      percentualElement.classList.add('text-green-500')
      percentualElement.textContent = `+${percentageDifference}%`
    } else {
      percentualElement.classList.add('text-red-500')
      percentualElement.textContent = `-${percentageDifference}%`
    }

    const data = {
      labels: [
        'Current month',
        'Last month',
      ],
      datasets: [{
        label: 'Total',
        data: [currentMonthReceivedQuantity, lastMonthReceivedQuantity],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
        ],
        hoverOffset: 4
      }]
    };

    const chartContainer = document.getElementById('received-quantity')
    buildPieChart(data, chartContainer)
  }


  const calculateMonthPercentual = (lastMonthQuantity = 0, currentMonthQuantity = 0) => {
    // Avoid division by zero if last month's quantity is 0
    const percentageDifference =
    lastMonthQuantity > 0
      ? ((currentMonthQuantity - lastMonthQuantity) /
          lastMonthQuantity) *
        100
      : currentMonthQuantity > 0
      ? 100 // If last month's quantity was 0 and current month has transfers
      : 0; // No transfers in either month

      return percentageDifference
  }

  transferredQuantityChart()
  receivedQuantityChart()
})