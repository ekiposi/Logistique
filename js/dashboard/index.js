document.addEventListener('DOMContentLoaded', () => {
    let medications = [];
    let devices = [];
    let equipment = [];
    let editingIndex = -1;

    const elements = {
        medicationForm: document.getElementById("add-medication-form"),
        deviceForm: document.getElementById("add-device-form"),
        equipmentForm: document.getElementById("add-equipment-form"),
        medicationTable: document.querySelector("#medication-table tbody"),
        deviceTable: document.querySelector("#device-table tbody"),
        equipmentTable: document.querySelector("#equipment tbody"),
        medicationListContainer: document.getElementById('medication-list'),
        totalStockValueCell: document.getElementById('total-stock-value'),
        searchBar: document.getElementById("search-bar"),
        categoryFilter: document.getElementById("category-filter"),
        expiredFilter: document.getElementById("expired-filter"),
        lowStockFilter: document.getElementById("low-stock-filter"),
        addMedicationBtn: document.getElementById("add-medication"),
        addDeviceBtn: document.getElementById("add-device"),
        addEquipmentBtn: document.getElementById("add-equipment"),
        medicationFormContainer: document.getElementById("medication-form"),
        deviceFormContainer: document.getElementById("device-form"),
        equipmentFormContainer: document.getElementById("equipment-form")
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'HTG' 
        }).format(value);
    };

    const isDateExpired = (expirationDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part to compare dates only
        
        const expDate = new Date(expirationDate);
        expDate.setHours(0, 0, 0, 0); // Reset time part to compare dates only
        
        return expDate <= today; // Will return true if expDate is today or earlier
    };

    const loadData = () => {
        // Load medications
        const storedMedications = localStorage.getItem('medications');
        medications = storedMedications ? JSON.parse(storedMedications) : [];

        // Load devices
        const storedDevices = localStorage.getItem('devices');
        devices = storedDevices ? JSON.parse(storedDevices) : [];

        // Load equipment
        const storedEquipment = localStorage.getItem('equipment');
        equipment = storedEquipment ? JSON.parse(storedEquipment) : [];

        // Render all tables
        renderFilteredTable();
        renderDeviceTable();
        renderEquipmentTable();
    };

    const loadMedications = () => {
        try {
            const storedMedications = localStorage.getItem('medications');
            medications = storedMedications 
                ? JSON.parse(storedMedications).map(med => ({
                    ...med,
                    isExpired: isDateExpired(med.expirationDate),
                    isLowStock: parseInt(med.quantity) < 10
                }))
                : [];
        } catch (error) {
            console.error('Error loading medications:', error);
            medications = [];
        }
    };

    const saveMedications = () => {
        localStorage.setItem('medications', JSON.stringify(medications));
    };

    const showMedicationForm = (index = -1) => {
        const formTitle = document.getElementById("form-title");
        
        if (index === -1) {
            formTitle.innerText = "Ajouter produit";
            elements.medicationForm.reset();
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier produit";
            const medication = medications[index];
            
            ['med-name', 'med-quantity', 'med-price', 'med-expirationDate', 'med-category']
                .forEach(id => {
                    const field = document.getElementById(id);
                    field.value = medication[id.split('-')[1]];
                });
            
            editingIndex = index;
        }
        
        elements.medicationFormContainer.classList.toggle("hidden");
    };

    const addMedication = (medication) => {
        // Validation
        if (medications.some((med, index) => 
            med.name.toLowerCase() === medication.name.toLowerCase() && 
            index !== editingIndex
        )) {
            alert("Ce produit existe déjà.");
            return;
        }

        const preparedMedication = {
            ...medication,
            isExpired: isDateExpired(medication.expirationDate),
            isLowStock: parseInt(medication.quantity) < 10
        };

        if (editingIndex === -1) {
            medications.push(preparedMedication);
        } else {
            medications[editingIndex] = preparedMedication;
            editingIndex = -1;
        }

        saveMedications();
        renderFilteredTable();
        generateMedicationReport();
        elements.medicationFormContainer.classList.add("hidden");
    };

    const downloadMedicationsPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Create table data manually instead of using html selector
        const tableColumn = ["Nom", "Quantité", "Prix", "Date d'expiration", "Catégorie", "Périmé", "Quantité Faible"];
        const tableRows = medications.map(med => [
            med.name,
            med.quantity,
            formatCurrency(parseFloat(med.price)),
            med.expirationDate,
            med.category,
            isDateExpired(med.expirationDate) ? 'Oui' : 'Non',
            parseInt(med.quantity) < 11 ? 'Oui' : 'Non'
        ]);

        doc.setFontSize(16);
        doc.text('CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Adresse : 5, Rue Rivière en face du Rectorat de l\'UEH', 105, 30, { align: 'center' });
        doc.text('Email: pharmachndlm@gmail.com', 105, 35, { align: 'center' });
        doc.text('Téléphone: +509 2910-3131', 105, 40, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        doc.setFontSize(14);
        doc.text('Liste des Médicaments', 105, 55, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleString()}`, 105, 65, { align: 'center' });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'striped',
            headStyles: { fillColor: [60, 141, 188] },
        });

        doc.save('liste_medicaments.pdf');
    };

    const renderFilteredTable = (dataToRender = medications) => {
        // Add download button if it doesn't exist
        if (!document.querySelector('#medication-pdf-button')) {
            const medicationTable = document.querySelector('#medication-table');
            if (medicationTable) {
                medicationTable.insertAdjacentHTML('beforebegin', `
                    <div class="flex justify-end mb-4">
                        <button id="medication-pdf-button" onclick="downloadMedicationsPDF()" class="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg">
                            Télécharger PDF Médicaments
                        </button>
                    </div>
                `);
            }
        }

        elements.medicationTable.innerHTML = dataToRender.map((med, index) => {
            const isLowStock = parseInt(med.quantity) < 4;
            const expired = isDateExpired(med.expirationDate);
            
            return `
                <tr>
                    <td>${med.name}</td>
                    <td>${med.quantity}</td>
                    <td>${formatCurrency(parseFloat(med.price))}</td>
                    <td>${med.expirationDate}</td>
                    <td>${med.category}</td>
                    <td>${expired ? 'Oui' : 'Non'}</td>
                    <td>${isLowStock ? 'Oui' : 'Non'}</td>
                    <td>
                        <button onclick="showMedicationForm(${index})" class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded-lg mr-2">Modifier</button>
                        <button onclick="deleteMedication(${index})" class="bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded-lg">Supprimer</button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    const generateMedicationReport = () => {
        const medicationListContainer = document.getElementById('medication-list');
        const totalStockValueCell = document.getElementById('total-stock-value');

        let totalStockValue = 0;
        const reportRows = medications.map(med => {
            const stockValue = med.quantity * parseFloat(med.price);
            totalStockValue += stockValue;

            return `
                <tr>
                    <td>${med.name}</td>
                    <td>${med.quantity}</td>
                    <td>${formatCurrency(parseFloat(med.price))}</td>
                    <td>${formatCurrency(stockValue)}</td>
                </tr>
            `;
        }).join('');

        medicationListContainer.innerHTML = reportRows;
        totalStockValueCell.textContent = formatCurrency(totalStockValue);
    };

    const deleteMedication = (index) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            medications.splice(index, 1);
            saveMedications();
            renderFilteredTable();
            generateMedicationReport();
        }
    };

    const setupEventListeners = () => {
        elements.addMedicationBtn.addEventListener("click", () => showMedicationForm());
        
        elements.medicationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const medication = {
                name: document.getElementById("med-name").value,
                quantity: document.getElementById("med-quantity").value,
                price: document.getElementById("med-price").value,
                expirationDate: document.getElementById("med-expirationDate").value,
                category: document.getElementById("med-category").value
            };

            if (Object.values(medication).some(val => !val)) {
                alert("Tous les champs sont obligatoires !");
                return;
            }

            addMedication(medication);
        });

        [
            elements.searchBar,
            elements.categoryFilter,
            elements.expiredFilter,
            elements.lowStockFilter
        ].forEach(element => {
            element.addEventListener(
                element.type === 'checkbox' ? 'change' : 'input', 
                renderFilteredTable
            );
        });

        elements.addDeviceBtn.addEventListener("click", () => showDeviceForm());
        elements.deviceForm.addEventListener("submit", handleDeviceSubmit);
        
        elements.addEquipmentBtn.addEventListener("click", () => showEquipmentForm());
        elements.equipmentForm.addEventListener("submit", handleEquipmentSubmit);

        // Add search functionality for all tables
        elements.searchBar.addEventListener('input', () => {
            const searchTerm = elements.searchBar.value.toLowerCase();
            
            // Filter and render medications
            const filteredMedications = medications.filter(med => 
                med.name.toLowerCase().includes(searchTerm) ||
                med.category?.toLowerCase().includes(searchTerm)
            );
            renderFilteredTable(filteredMedications);

            // Filter and render devices
            const filteredDevices = devices.filter(device => 
                device.name.toLowerCase().includes(searchTerm) ||
                device.function.toLowerCase().includes(searchTerm) ||
                device.additionalInfo?.toLowerCase().includes(searchTerm)
            );
            renderDeviceTable(filteredDevices);

            // Filter and render equipment
            const filteredEquipment = equipment.filter(equip => 
                equip.name.toLowerCase().includes(searchTerm) ||
                equip.function.toLowerCase().includes(searchTerm) ||
                equip.type.toLowerCase().includes(searchTerm) ||
                equip.additionalInfo?.toLowerCase().includes(searchTerm)
            );
            renderEquipmentTable(filteredEquipment);
        });
    };

    const initializeApp = () => {
        loadData();
        setupEventListeners();
        
        // Add download buttons for all tables
        const addDownloadButtons = () => {
            // Device table button
            const deviceTable = document.querySelector('#device-table');
            if (deviceTable && !document.querySelector('#device-pdf-button')) {
                deviceTable.parentElement.insertAdjacentHTML('afterbegin', `
                    <div class="flex justify-end mb-4">
                        <button id="device-pdf-button" onclick="downloadDevicesPDF()" class="text-white py-2 px-4 rounded-lg bg-blue-400 hover:bg-blue-500">
                            Télécharger PDF Appareils
                        </button>
                    </div>
                `);
            }

            // Equipment table button
            const equipmentTable = document.querySelector('#equipment');
            if (equipmentTable && !document.querySelector('#equipment-pdf-button')) {
                equipmentTable.parentElement.insertAdjacentHTML('afterbegin', `
                    <div class="flex justify-end mb-4">
                        <button id="equipment-pdf-button" onclick="downloadEquipmentPDF()" class="text-white bg-blue-400 py-2 px-4 rounded-lg">
                            Télécharger PDF Équipements
                        </button>
                    </div>
                `);
            }
        };

        // Add the buttons
        addDownloadButtons();
        
        // Render all tables
        renderFilteredTable();
        renderDeviceTable();
        renderEquipmentTable();
    };

    window.showMedicationForm = showMedicationForm;
    window.deleteMedication = deleteMedication;

    // Initialize charts when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Stock Movement Chart
        const stockCtx = document.getElementById('stockMovementChart').getContext('2d');
        new Chart(stockCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Entrées',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Sorties',
                    data: [28, 48, 40, 19, 86, 27],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Category Distribution Chart
        const categoryCtx = document.getElementById('categoryDistributionChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Catégorie A', 'Catégorie B', 'Catégorie C', 'Autres'],
                datasets: [{
                    data: [300, 50, 100, 80],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Update dashboard cards with real data
        updateDashboardCards();
    });

    function updateDashboardCards() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        
        // Update total stock
        const totalStock = medications.reduce((sum, med) => sum + parseInt(med.quantity), 0);
        document.getElementById('total-stock-count').textContent = totalStock;

        // You'll need to implement these functions based on your data structure
        // document.getElementById('transfers-count').textContent = getTransferCount();
        // document.getElementById('received-count').textContent = getReceivedCount();
    }

    window.showDeviceForm = (index = -1) => {
        // Toggle visibility
        elements.deviceFormContainer.classList.toggle("hidden");
        
        // If already visible, hide and return
        if (elements.deviceFormContainer.classList.contains("hidden")) {
            return;
        }

        const formTitle = document.getElementById("device-form-title");
        
        if (index === -1) {
            formTitle.innerText = "Ajouter un appareil médical";
            elements.deviceForm.reset();
            // Format today's date as YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            document.getElementById("device-date").value = today;
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier un appareil médical";
            const device = devices[index];
            document.getElementById("device-name").value = device.name || '';
            document.getElementById("device-quantity").value = device.quantity || '';
            document.getElementById("device-date").value = device.dateAdded || new Date().toISOString().split('T')[0];
            document.getElementById("device-function").value = device.function || '';
            document.getElementById("device-info").value = device.additionalInfo || '';
            editingIndex = index;
        }
    };

    window.showEquipmentForm = (index = -1) => {
        // Toggle visibility
        elements.equipmentFormContainer.classList.toggle("hidden");
        
        // If already visible, hide and return
        if (elements.equipmentFormContainer.classList.contains("hidden")) {
            return;
        }

        const formTitle = document.getElementById("equipment-form-title");
        
        if (index === -1) {
            formTitle.innerText = "Ajouter un équipement médical";
            elements.equipmentForm.reset();
            // Format today's date as YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            document.getElementById("equip-date").value = today;
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier un équipement médical";
            const equip = equipment[index];
            document.getElementById("equip-name").value = equip.name || '';
            document.getElementById("equip-quantity").value = equip.quantity || '';
            document.getElementById("equip-date").value = equip.dateAdded || new Date().toISOString().split('T')[0];
            document.getElementById("equip-function").value = equip.function || '';
            document.getElementById("equip-type").value = equip.type || '';
            document.getElementById("equip-info").value = equip.additionalInfo || '';
            editingIndex = index;
        }
    };

    const handleDeviceSubmit = (event) => {
        event.preventDefault();
        
        const device = {
            name: document.getElementById("device-name").value,
            quantity: document.getElementById("device-quantity").value,
            dateAdded: document.getElementById("device-date").value,
            function: document.getElementById("device-function").value,
            additionalInfo: document.getElementById("device-info").value,
            isLowStock: parseInt(document.getElementById("device-quantity").value) < 4
        };

        // Check if any required field is empty
        const requiredFields = ["name", "quantity", "dateAdded", "function"];
        const missingFields = requiredFields.filter(field => !device[field]);
        
        if (missingFields.length > 0) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        if (editingIndex === -1) {
            devices.push(device);
        } else {
            devices[editingIndex] = device;
            editingIndex = -1;
        }

        localStorage.setItem('devices', JSON.stringify(devices));
        renderDeviceTable();
        elements.deviceFormContainer.classList.add("hidden");
    };

    const handleEquipmentSubmit = (event) => {
        event.preventDefault();
        
        const equip = {
            name: document.getElementById("equip-name").value,
            quantity: document.getElementById("equip-quantity").value,
            dateAdded: document.getElementById("equip-date").value,
            function: document.getElementById("equip-function").value,
            type: document.getElementById("equip-type").value,
            additionalInfo: document.getElementById("equip-info").value,
            isLowStock: parseInt(document.getElementById("equip-quantity").value) < 4
        };

        // Check if any required field is empty
        const requiredFields = ["name", "quantity", "dateAdded", "function", "type"];
        const missingFields = requiredFields.filter(field => !equip[field]);
        
        if (missingFields.length > 0) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        if (editingIndex === -1) {
            equipment.push(equip);
        } else {
            equipment[editingIndex] = equip;
            editingIndex = -1;
        }

        localStorage.setItem('equipment', JSON.stringify(equipment));
        renderEquipmentTable();
        elements.equipmentFormContainer.classList.add("hidden");
    };

    const renderDeviceTable = () => {
        elements.deviceTable.innerHTML = devices.map((device, index) => `
            <tr>
                <td>${device.name}</td>
                <td>${device.quantity}</td>
                <td>${device.dateAdded}</td>
                <td>${device.function}</td>
                <td>${device.isLowStock ? 'Oui' : 'Non'}</td>
                <td>${device.additionalInfo}</td>
                <td>
                    <button onclick="showDeviceForm(${index})" class="text-black py-1 px-2 rounded-lg mr-2">Modifier</button>
                    <button onclick="deleteDevice(${index})" class="text-black py-1 px-2 rounded-lg">Supprimer</button>
                </td>
            </tr>
        `).join('');

        // Add download button if it doesn't exist
        if (!document.querySelector('#device-pdf-button')) {
            const deviceTable = document.querySelector('#device-table');
            if (deviceTable) {
                deviceTable.insertAdjacentHTML('beforebegin', `
                    <div class="flex justify-end mb-4">
                        <button id="device-pdf-button" onclick="downloadDevicesPDF()" class="text-white bg-blue-400 py-2 px-4 rounded-lg">
                            Télécharger PDF Appareils
                        </button>
                    </div>
                `);
            }
        }
    };

    const renderEquipmentTable = () => {
        elements.equipmentTable.innerHTML = equipment.map((equip, index) => `
            <tr>
                <td>${equip.name}</td>
                <td>${equip.quantity}</td>
                <td>${equip.dateAdded}</td>
                <td>${equip.function}</td>
                <td>${equip.type}</td>
                <td>${equip.isLowStock ? 'Oui' : 'Non'}</td>
                <td>${equip.additionalInfo}</td>
                <td>
                    <button onclick="showEquipmentForm(${index})" class="text-black py-1 px-2 rounded-lg mr-2">Modifier</button>
                    <button onclick="deleteEquipment(${index})" class="text-black py-1 px-2 rounded-lg">Supprimer</button>
                </td>
            </tr>
        `).join('');

        // Add download button if it doesn't exist
        if (!document.querySelector('#equipment-pdf-button')) {
            const equipmentTable = document.querySelector('#equipment');
            if (equipmentTable) {
                equipmentTable.insertAdjacentHTML('beforebegin', `
                    <div class="flex justify-end mb-4">
                        <button id="equipment-pdf-button" onclick="downloadEquipmentPDF()" class="text-white bg-blue-400 py-2 px-4 rounded-lg">
                            Télécharger PDF Équipements
                        </button>
                    </div>
                `);
            }
        }
    };

    // Add these to your window object
    window.showDeviceForm = showDeviceForm;
    window.showEquipmentForm = showEquipmentForm;
    window.deleteDevice = (index) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet appareil ?")) {
            devices.splice(index, 1);
            localStorage.setItem('devices', JSON.stringify(devices));
            renderDeviceTable();
        }
    };
    window.deleteEquipment = (index) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
            equipment.splice(index, 1);
            localStorage.setItem('equipment', JSON.stringify(equipment));
            renderEquipmentTable();
        }
    };

    const downloadDevicesPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Create table data manually
        const tableColumn = ["Nom", "Quantité", "Date d'ajout", "Fonction", "Quantité Faible", "Informations", "Action"];
        const tableRows = devices.map(device => [
            device.name,
            device.quantity,
            device.dateAdded,
            device.function,
            device.isLowStock ? 'Oui' : 'Non',
            device.additionalInfo,
            '' // Empty action column for PDF
        ]);

        doc.setFontSize(16);
        doc.text('CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Adresse : 5, Rue Rivière en face du Rectorat de l\'UEH', 105, 30, { align: 'center' });
        doc.text('Email: pharmachndlm@gmail.com', 105, 35, { align: 'center' });
        doc.text('Téléphone: +509 2910-3131', 105, 40, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        doc.setFontSize(14);
        doc.text('Liste des Appareils', 105, 55, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleString()}`, 105, 65, { align: 'center' });

        doc.autoTable({
            html: '#device-table',
            startY: 75,
            theme: 'striped',
            headStyles: { fillColor: [60, 141, 188] },
        });

        doc.save('liste_appareils.pdf');
    };

    const downloadEquipmentPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Create table data manually
        const tableColumn = ["Nom", "Quantité", "Date d'ajout", "Fonction", "Type", "Quantité Faible", "Informations", "Action"];
        const tableRows = equipment.map(equip => [
            equip.name,
            equip.quantity,
            equip.dateAdded,
            equip.function,
            equip.type,
            equip.isLowStock ? 'Oui' : 'Non',
            equip.additionalInfo,
             // Empty action column for PDF
        ]);

        doc.setFontSize(16);
        doc.text('CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Adresse : 5, Rue Rivière en face du Rectorat de l\'UEH', 105, 30, { align: 'center' });
        doc.text('Email: pharmachndlm@gmail.com', 105, 35, { align: 'center' });
        doc.text('Téléphone: +509 2910-3131', 105, 40, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        doc.setFontSize(14);
        doc.text('Liste des Équipements', 105, 55, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleString()}`, 105, 65, { align: 'center' });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'striped',
            headStyles: { fillColor: [60, 141, 188] }
        });

        doc.save('liste_equipements.pdf');
    };

    // Make all functions available globally
    window.downloadMedicationsPDF = downloadMedicationsPDF;
    window.downloadDevicesPDF = downloadDevicesPDF;
    window.downloadEquipmentPDF = downloadEquipmentPDF;
    window.showMedicationForm = showMedicationForm;
    window.deleteMedication = deleteMedication;
    window.showDeviceForm = showDeviceForm;
    window.showEquipmentForm = showEquipmentForm;
    window.deleteDevice = deleteDevice;
    window.deleteEquipment = deleteEquipment;
    
    // Initialize
    loadData();
    setupEventListeners();
    initializeApp();
});