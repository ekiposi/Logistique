
function formatPdf(name, table, content) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    // doc.autoTable(table);
    doc.text('CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text('Adresse : 5, Rue Rivière en face du Rectorat de l\'UEH', 105, 30, null, null, 'center');
    doc.text('Email: pharmachndlm@gmail.com', 105, 35, null, null, 'center');
    doc.text('Téléphone: +509 2910-3131', 105, 40, null, null, 'center');
    
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    doc.setFontSize(12);
    doc.text('Estimation Totale des Stocks', 105, 55, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 105, 65, null, null, 'center');

    
    doc.save(name)
}