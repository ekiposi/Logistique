document.addEventListener('DOMContentLoaded', () => {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const salesTableBody = document.querySelector('#sales-report-table tbody');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const salesFilter = document.getElementById('sales-filter');
    const totalAmountElement = document.getElementById('total-amount');
    const filterButton = document.getElementById('filter-button');
    const downloadPdfButton = document.getElementById('download-pdf');
    const addSaleButton = document.getElementById('add-sale');
    const addSaleModal = document.getElementById('add-sale-modal');
    const closeModalSpan = document.querySelector('.close');
    const newSaleForm = document.getElementById('new-sale-form');

    const calculateTotalSales = (data) => {
        return data.reduce((total, sale) => {
            return total + sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }, 0).toFixed(2);
    };

    const renderTable = (data) => {
        salesTableBody.innerHTML = ''; 
    
        if (data.length === 0) {
            salesTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Aucune donnée disponible</td></tr>';
            totalAmountElement.textContent = '0';
            return;
        }
        
        const totalSales = calculateTotalSales(data);
    
        data.forEach((sale) => {
            const row = document.createElement('tr');
            const totalSaleForRow = sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.clientName}</td>
                <td>${sale.items.map(item => item.medication).join(', ')}</td>
                <td>${sale.items.map(item => item.quantity).join(', ')}</td>
                <td>${sale.items.map(item => `${item.price} GDES`).join(', ')}</td>
                <td>${totalSaleForRow.toFixed(2)} GDES</td>
            `;
            salesTableBody.appendChild(row);
        });
    
        totalAmountElement.textContent = totalSales; 
    };

    const filterSales = () => {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const filter = salesFilter.value;

        const filteredSales = salesHistory.filter((sale) => {
            const saleDate = new Date(sale.date);

            const withinDateRange =
                (!startDate || saleDate >= startDate) &&
                (!endDate || saleDate <= endDate);

            if (filter === 'ventes-elevees') {
                return withinDateRange && sale.items.some(item => item.quantity > 50);
            } else if (filter === 'ventes-moyennes') {
                return withinDateRange && sale.items.some(item => item.quantity > 20 && item.quantity <= 50);
            } else if (filter === 'ventes-faibles') {
                return withinDateRange && sale.items.some(item => item.quantity <= 20);
            }

            return withinDateRange;
        });

        renderTable(filteredSales);
    };

    const downloadPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Rapport de Ventes - CHNDLM S.A - Pharma', 105, 20, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, 105, 40, null, null, 'center');
        doc.text(`Total des ventes pendant cette période : ${totalAmountElement.textContent} GDES`, 105, 50, null, null, 'center');

        doc.autoTable({
            html: '#sales-report-table',
            startY: 60,
            theme: 'striped',
            headStyles: { fillColor: [60, 141, 188] },
        });

        doc.save('rapport_de_ventes.pdf');
    };

    const openAddSaleModal = () => {
        addSaleModal.style.display = 'block';
    };

    const closeModal = () => {
        addSaleModal.style.display = 'none';
    };

    const addNewSale = (event) => {
        event.preventDefault();
        
        const clientName = document.getElementById('client-name').value;
        const medication = document.getElementById('medication').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const unitPrice = parseFloat(document.getElementById('unit-price').value);

        const newSale = {
            date: new Date().toISOString().split('T')[0],
            clientName: clientName,
            items: [{
                medication: medication,
                quantity: quantity,
                price: unitPrice
            }]
        };

        salesHistory.push(newSale);
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

        renderTable(salesHistory);
        closeModal();
        newSaleForm.reset();
    };

    filterButton.addEventListener('click', filterSales);
    downloadPdfButton.addEventListener('click', downloadPDF);
    addSaleButton.addEventListener('click', openAddSaleModal);
    closeModalSpan.addEventListener('click', closeModal);
    newSaleForm.addEventListener('submit', addNewSale);

    renderTable(salesHistory); 
});

window.addEventListener('click', (event) => {
    if (event.target === addSaleModal) {
        addSaleModal.style.display = 'none';
    }
});