document.addEventListener('DOMContentLoaded', () => {
  const { isSameMonth } = window.dateFns

  const productsStock = JSON.parse(localStorage.getItem('products_stock')) || []

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
    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    const chartContainer = document.getElementById('transferred-quantity')

    buildPieChart(data, chartContainer)
  }

  const receivedQuantityChart = () => {
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

  transferredQuantityChart()
  receivedQuantityChart()
})