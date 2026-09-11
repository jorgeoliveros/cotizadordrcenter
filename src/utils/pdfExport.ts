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

    let renderWidth = pdfWidth;
    let renderHeight = (canvas.height * pdfWidth) / canvas.width;
    let xOffset = 0;
    let yOffset = 0;

    // Enforce strict 1-page A4 fit: if the rendered height exceeds the A4 page height,
    // proportionally scale down to fit comfortably on one single page.
    if (renderHeight > pdfHeight) {
      const ratio = pdfHeight / renderHeight;
      renderWidth = pdfWidth * ratio;
      renderHeight = pdfHeight;
      xOffset = (pdfWidth - renderWidth) / 2;
    }

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight, undefined, 'FAST');

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF with html2canvas/jspdf:', error);
    // Fallback to browser print dialog
    window.print();
    return false;
  }
}
