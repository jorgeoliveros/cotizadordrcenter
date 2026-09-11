import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportQuoteToPdf(elementId: string, fileName: string = 'Cotizacion.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Generate high-resolution canvas (scale 2.5x to 3x guarantees crisp text & sharp high-res logo)
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Remove shadows and outer borders for clean A4 printing
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0px';
          clonedElement.style.border = 'none';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Tolerance of 4mm for slight rounding differences to ensure it fits perfectly on a single A4 page
    if (imgHeight <= pdfHeight + 4) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), undefined, 'FAST');
    } else {
      // Multiple pages support if content exceeds single page
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF with html2canvas/jspdf:', error);
    // Fallback to browser print dialog
    window.print();
    return false;
  }
}
