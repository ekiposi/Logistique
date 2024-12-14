// Form visibility functions
export function showDeviceForm() {
    document.getElementById('medication-form').style.display = 'none';
    document.getElementById('equipment-form').style.display = 'none';
    document.getElementById('device-form').style.display = 'block';
}

export function showMedicationForm() {
    document.getElementById('medication-form').style.display = 'block';
    document.getElementById('equipment-form').style.display = 'none';
    document.getElementById('device-form').style.display = 'none';
}

export function showEquipmentForm() {
    document.getElementById('medication-form').style.display = 'none';
    document.getElementById('equipment-form').style.display = 'block';
    document.getElementById('device-form').style.display = 'none';
}
