medications = JSON.parse(localStorage.getItem('medications')) || [];

medicationSelectTemplate = document.querySelector('.medication-select');
addSaleItemButton = document.getElementById('add-sale-item');
salesItemsContainer = document.getElementById('sales-items');
totalDisplay = document.getElementById('sales-total');
salesForm = document.getElementById('sales-form');
refreshButton = document.getElementById('refresh-button');

populateMedicationSelect = (selectElement) => {
 let fragment = document.createDocumentFragment();
 medications.forEach((med, index) => {
   const expirationDate = new Date(med.expirationDate);
   const currentDate = new Date();
   if (expirationDate > currentDate) {
     const option = document.createElement('option');
     option.value = index;
     option.textContent = `${med.name} - ${med.quantity} disponibles - ${med.price} GDES`;
     fragment.appendChild(option);
   }
 });
 selectElement.innerHTML = '<option value="">Choisir un médicament</option>';
 selectElement.appendChild(fragment);
};

addSaleItem = () => {
 const saleItem = document.createElement('div');
 saleItem.classList.add('sales-item');
 saleItem.innerHTML = `
   <select class="medication-select">
     <option value="">Choisir un médicament</option>
   </select>
   <input type="number" class="sale-quantity" placeholder="Quantité" required>
   <button class="remove-sale-item">Supprimer</button>
   <p class="stock-warning" style="color: red; display: none;">Stock insuffisant pour cet article</p>
 `;
 salesItemsContainer.appendChild(saleItem);
 const newSelectElement = saleItem.querySelector('.medication-select');
 populateMedicationSelect(newSelectElement);
};

calculateTotal = () => {
 let total = 0;
 const saleItems = salesItemsContainer.querySelectorAll('.sales-item');

 saleItems.forEach(item => {
   const medicationIndex = item.querySelector('.medication-select').value;
   const quantity = parseInt(item.querySelector('.sale-quantity').value, 10) || 0;
   const stockWarning = item.querySelector('.stock-warning');

   if (medicationIndex && quantity > 0) {
     const medication = medications[medicationIndex];
     const price = medication.price;
     total += price * quantity;

     if (quantity > medication.quantity) {
       stockWarning.style.display = 'block';
     } else {
       stockWarning.style.display = 'none';
     }
   }
 });

 totalDisplay.textContent = `Total : ${total} GDES`;
};

removeSaleItem = (item) => {
 item.remove();
 calculateTotal();
};

const addSaleToHistory = (itemsSold) => {
 const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || []

 const updatedSalesHistory = [...salesHistory, ...itemsSold]
 localStorage.setItem('salesHistory', JSON.stringify(updatedSalesHistory));
}

const updateData = (itemsSold) => {
 addSaleToHistory(itemsSold)
 localStorage.setItem('medications', JSON.stringify(medications));
}

salesForm.addEventListener('submit', (event) => {
 event.preventDefault();

 const buyerName = document.getElementById('buyer-name').value;
 const buyerPhone = document.getElementById('buyer-phone').value;
 const buyerEmail = document.getElementById('buyer-email').value;
 const saleItems = salesItemsContainer.querySelectorAll('.sales-item');
 const itemsSold = [];
 let isFormValid = true;

 saleItems.forEach(item => {
   const medicationIndex = item.querySelector('.medication-select').value;
   const quantity = parseInt(item.querySelector('.sale-quantity').value, 10) || 0;

   if (medicationIndex && quantity > 0) {
     const medication = medications[medicationIndex];
     if (quantity > medication.quantity) {
       isFormValid = false;
     } else {
       itemsSold.push({
         medication: medication.name,
         quantity,
         price: Number(medication.price),
         date: window.dateFns.format(new Date(), 'dd-MM-yyyy'),
         clientName: buyerName,
         category: medication.category
       });
       medication.quantity -= quantity;
     }
   }
 });

 if (!isFormValid) {
   alert('Quantité insuffisante pour l’un des articles sélectionnés.');
   return;
 }

 updateData(itemsSold)
 printReceipt(buyerName, buyerPhone, buyerEmail, itemsSold);
 salesForm.reset();
 salesItemsContainer.innerHTML = '';
 calculateTotal();
});

const printReceipt = (buyerName, buyerPhone, buyerEmail, itemsSold) => {
  const receiptContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Receipt</title>
    <style>
      @page {
        size: 72mm auto; /* Ensure page width is set to 72mm */
        margin: 0;
      }
      body {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        width: 72mm; /* Ensure body content width is 72mm */
        margin: 0;
        padding: 10px;
      }
      .receipt-container {
        max-width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f7f7f7;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .receipt-container h2 {
        text-align: center;
        color: #2c3e50;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
      }
      .receipt-container p {
        font-size: 10px;
        color: #7f8c8d;
        margin: 3px 0;
      }
      .table-header {
        text-align: left;
        font-size: 10px;
        background-color: black;
        color: white;
        padding: 4px 5px;
      }
      .table-cell {
        padding: 4px 5px;
        font-size: 10px;
        border-bottom: 1px solid #ddd;
        color: #333;
        text-align: right;
      }
      .footer-text {
        text-align: center;
        font-size: 10px;
        margin-top: 10px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="receipt-container">
      <div style="text-align: center; margin-bottom: 15px;">
        <h2>CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma</h2>
        <p>Adresse : 5, Rue Rivière en face du Rectorat de l'UEH</p>
        <p>Email: <a href="mailto:pharmachndlm@gmail.com" style="color: #7f8c8d; text-decoration: none;">pharmachndlm@gmail.com</a></p>
        <p>Téléphone: +509 2910-3131</p>
      </div>
      <div style="border-bottom: 2px solid black; margin-bottom: 10px;"></div>
      <p style="font-size: 10px; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p style="font-size: 10px; margin: 5px 0;"><strong>Nom de l'acheteur:</strong> ${buyerName}</p>
      <p style="font-size: 10px; margin: 5px 0;"><strong>Numéro de téléphone:</strong> ${buyerPhone}</p>
      <p style="font-size: 10px; margin: 5px 0;"><strong>Email:</strong> ${buyerEmail}</p>
      <div style="border-bottom: 2px solid black; margin: 10px 0;"></div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <thead>
          <tr>
            <th class="table-header" style="text-align: left;">Médicament(s)</th>
            <th class="table-header">Quantité(s)</th>
            <th class="table-header">Prix unitaire</th>
            <th class="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsSold.map(item => `
            <tr>
              <td style="text-align: left;" class="table-cell">${item.medication}</td>
              <td class="table-cell">${item.quantity}</td>
              <td class="table-cell">${item.price} GDES</td>
              <td class="table-cell">${(item.quantity * item.price).toFixed(2)} GDES</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="border-top: 2px solid black; margin-top: 10px; padding-top: 5px;">
        <p style="text-align: right; font-size: 12px; font-weight: bold; color: black;">Total: ${itemsSold.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)} GDES</p>
      </div>
      <div style="border-top: 2px solid black; margin: 10px 0;"></div>
      <p class="footer-text">Merci pour votre achat ! Bon rétablissement à vous.</p>
      <p class="footer-text" style="color: black;">Le système a été conçu par NexGen Spark | Tél : +509 42 00 03 15 / +509 36 44 46 75</p>
    </div>
  </body>
  </html>
  `;

  // Open a new window and print the receipt
  const printWindow = window.open('', '', 'height=400,width=350');
  printWindow.document.write(receiptContent);
  printWindow.document.close();
  printWindow.print();
};


addSaleItemButton.addEventListener('click', addSaleItem);

salesItemsContainer.addEventListener('input', calculateTotal);

salesItemsContainer.addEventListener('click', (event) => {
 if (event.target.classList.contains('remove-sale-item')) {
   removeSaleItem(event.target.closest('.sales-item'));
 }
});

refreshButton.addEventListener('click', () => location.reload());

populateMedicationSelect(document.querySelector('.medication-select'));
calculateTotal();