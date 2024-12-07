document.addEventListener('DOMContentLoaded', () => {
    const StorageManager = {
        getSalesHistory() {
            try {
                const sales = JSON.parse(localStorage.getItem('salesHistory')) || [];
                return Array.isArray(sales) ? sales : [];
            } catch (error) {
                console.error('Error retrieving sales history:', error);
                return [];
            }
        },

        saveSalesHistory(salesHistory) {
            try {
                localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
            } catch (error) {
                console.error('Error saving sales history:', error);
                
                if (error instanceof DOMException) {
                    if (error.name === 'QuotaExceededError') {
                        alert('Limite de stockage dépassée. Veuillez supprimer anciennes données.');
                    }
                }
            }
        },

        syncSalesToCSV() {
            const salesHistory = this.getSalesHistory();

            // Add total price calculation to each sale
            const salesWithTotals = salesHistory.map(sale => ({
                ...sale,
                totalPrice: sale.quantity * sale.price
            }));

            // Prepare CSV data
            const csvHeader = 'Date,Client Name,Medication,Quantity,Unit Price,Total Price\n';
            const csvRows = salesWithTotals.map(sale => 
                `${sale.date},${sale.clientName},${sale.medication},${sale.quantity},${sale.price},${sale.totalPrice}`
            ).join('\n');

            const csvContent = csvHeader + csvRows;

            // Create a blob and download the CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sales.csv';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Add sync to CSV button to the DOM
    const filterSection = document.querySelector('.filter-section');
    const syncButton = document.createElement('button');
    syncButton.id = 'sync-csv';
    syncButton.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md ml-4';
    syncButton.textContent = 'Synchroniser CSV';
    syncButton.addEventListener('click', () => {
        try {
            StorageManager.syncSalesToCSV();
            console.log('Synchronization successful');
        } catch (error) {
            console.error('Synchronization error:', error);
            alert('An error occurred during synchronization. Please try again.');
        }
    });
    filterSection.appendChild(syncButton);
    syncButton.style.color = 'black';

    // Optional: Automatic sync every 3 hours
    const autoSyncInterval = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    setInterval(() => {
        try {
            StorageManager.syncSalesToCSV();
            console.log('Automatic synchronization successful');
        } catch (error) {
            console.error('Automatic synchronization error:', error);
        }
    }, autoSyncInterval);
});