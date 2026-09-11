import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportQuoteToPdf(elementId: string, fileName: string = 'Cotizacion.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // 1. Generate high-resolution canvas with explicit white background and scale 2 as requested
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Force light mode and eliminate dark mode inheritance completely in the cloned capture
        clonedDoc.documentElement.classList.remove('dark');
        clonedDoc.body.classList.remove('dark');
        clonedDoc.documentElement.style.backgroundColor = '#ffffff';
        clonedDoc.documentElement.style.colorScheme = 'light';
        clonedDoc.body.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.color = '#1a1a1a';
        clonedDoc.body.style.colorScheme = 'light';

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Explicit inline white background, dark text, and 20px top padding
          clonedElement.style.setProperty('background-color', '#ffffff', 'important');
          clonedElement.style.setProperty('color', '#1a1a1a', 'important');
          clonedElement.style.setProperty('padding-top', '20px', 'important');
          clonedElement.style.setProperty('box-shadow', 'none', 'important');
          clonedElement.style.setProperty('border-radius', '0px', 'important');
          clonedElement.style.setProperty('border', 'none', 'important');
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

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Margins: [15, 10, 15, 10] -> 15mm top/bottom, 10mm left/right
    const marginTop = 15;
    const marginBottom = 15;
    const marginLeft = 10;
    const marginRight = 10;

    const printableWidth = pdfWidth - marginLeft - marginRight;   // 190mm
    const printableHeight = pdfHeight - marginTop - marginBottom; // 267mm

    // Calculate proportional rendering dimensions to fit comfortably on 1 single page
    let renderWidth = printableWidth;
    let renderHeight = (canvas.height * printableWidth) / canvas.width;

    if (renderHeight > printableHeight) {
      const ratio = printableHeight / renderHeight;
      renderWidth = renderWidth * ratio;
      renderHeight = printableHeight;
    }

    const xOffset = marginLeft + (printableWidth - renderWidth) / 2;
    const yOffset = marginTop;

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
