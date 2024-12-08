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
        const expDate = new Date(expirationDate);
        const currentDate = new Date();
        return expDate <= currentDate;
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
            
            ['med-name', 'med-quantity', 'med-price', 'med-expiration', 'med-category']
                .forEach(id => {
                    const field = document.getElementById(id);
                    field.value = medication[field.name.replace('med-', '')];
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

    const renderFilteredTable = () => {
        const searchValue = elements.searchBar.value.toLowerCase();
        const filterCategory = elements.categoryFilter.value;
        const showExpired = elements.expiredFilter.checked;
        const showLowStock = elements.lowStockFilter.checked;

        const filteredMedications = medications.filter(med => 
            med.name.toLowerCase().includes(searchValue) &&
            (!filterCategory || med.category === filterCategory) &&
            (!showExpired || med.isExpired) &&
            (!showLowStock || med.isLowStock)
        );

        elements.medicationTable.innerHTML = filteredMedications.map((med, index) => `
            <tr>
                <td>${med.name}</td>
                <td>${med.quantity}</td>
                <td>${formatCurrency(parseFloat(med.price))}</td>
                <td>${med.expirationDate}</td>
                <td>${med.category}</td>
                <td>${med.isExpired ? 'Oui' : 'Non'}</td>
                <td>${med.isLowStock ? 'Oui' : 'Non'}</td>
                <td>
                    ${!med.isExpired ? `<button onclick="showMedicationForm(${index})">Modifier</button>` : ''}
                    <button onclick="deleteMedication(${index})">Supprimer</button>
                </td>
            </tr>
        `).join('');
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
                expirationDate: document.getElementById("med-expiration").value,
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
    };

    const initializeApp = () => {
        loadMedications();
        setupEventListeners();
        renderFilteredTable();
        generateMedicationReport();
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

    const showDeviceForm = (index = -1) => {
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
            // Set current date for dateAdded
            document.getElementById("device-date").valueAsDate = new Date();
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier un appareil médical";
            const device = devices[index];
            ['device-name', 'device-quantity', 'device-date', 'device-function', 'device-info'].forEach(id => {
                const field = document.getElementById(id);
                field.value = device[field.name.replace('device-', '')];
            });
            editingIndex = index;
        }
    };

    const showEquipmentForm = (index = -1) => {
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
            // Set current date for dateAdded
            document.getElementById("equip-date").valueAsDate = new Date();
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier un équipement médical";
            const equip = equipment[index];
            ['equip-name', 'equip-quantity', 'equip-date', 'equip-function', 'equip-type', 'equip-info'].forEach(id => {
                const field = document.getElementById(id);
                field.value = equip[field.name.replace('equip-', '')];
            });
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
            isLowStock: parseInt(document.getElementById("device-quantity").value) < 10
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
            isLowStock: parseInt(document.getElementById("equip-quantity").value) < 10
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

    initializeApp();
});