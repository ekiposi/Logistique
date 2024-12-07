document.addEventListener('DOMContentLoaded', () => {
    let medications = [];
    let editingIndex = -1;

    const elements = {
        medicationForm: document.getElementById("add-medication-form"),
        medicationTable: document.querySelector("#medication-table tbody"),
        medicationListContainer: document.getElementById('medication-list'),
        totalStockValueCell: document.getElementById('total-stock-value'),
        searchBar: document.getElementById("search-bar"),
        categoryFilter: document.getElementById("category-filter"),
        expiredFilter: document.getElementById("expired-filter"),
        lowStockFilter: document.getElementById("low-stock-filter"),
        addMedicationBtn: document.getElementById("add-medication"),
        medicationFormContainer: document.getElementById("medication-form")
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
            formTitle.innerText = "Ajouter Médicament";
            elements.medicationForm.reset();
            editingIndex = -1;
        } else {
            formTitle.innerText = "Modifier Médicament";
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
            alert("Ce Médicament existe déjà.");
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
                    <button onclick="deleteMedication(${index})" style="display: none;">Supprimer</button>
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
        if (confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) {
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
    };

    const initializeApp = () => {
        loadMedications();
        setupEventListeners();
        renderFilteredTable();
        generateMedicationReport();
    };

    window.showMedicationForm = showMedicationForm;
    window.deleteMedication = deleteMedication;

    initializeApp();
});