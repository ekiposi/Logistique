function formatPdf(title, description = '', table, namePdf) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // top
    getHeaderPdf(doc, title)

    //body
    doc.text(description, 150, 70, null, null, 'right');
    doc.autoTable(table);
    
    //footer
    getFootPdf(doc)

    doc.save(namePdf)
}

function getHeaderPdf(doc, title = '') {
    doc.setFontSize(16);
    doc.text('CENTRE HOSPITALIER NOTRE DAME DE LA MERCI S.A - Pharma', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text('Adresse : 5, Rue Rivière en face du Rectorat de l\'UEH', 105, 30, null, null, 'center');
    doc.text('Email: pharmachndlm@gmail.com', 105, 35, null, null, 'center');
    doc.text('Téléphone: +509 2910-3131', 105, 40, null, null, 'center');
    doc.setLineWidth(0.5);
    doc.setFontSize(12);
    doc.text(title, 105, 55, null, null, 'center');
    doc.line(10, 45, 200, 45);
}

function getFootPdf(doc) {
    const pageHeight = doc.internal.pageSize.height;
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Data: ${date}`, 15, pageHeight - 10);
}