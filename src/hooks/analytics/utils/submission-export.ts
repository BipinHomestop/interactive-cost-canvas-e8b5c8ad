
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx';

type SubmissionData = Array<{
  id: string;
  created_at: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  garage_capacity: number;
  garage_finish: string;
  need_stem_walls: string;
  stem_wall_type?: string;
  need_steps?: string;
  need_extra_footage?: string;
  extra_footage?: string;
  current_condition?: string;
  total_price?: number;
  payment_status: string;
}>;

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

// Format currency for CSV/Excel
const formatCurrency = (amount?: number) => {
  if (!amount && amount !== 0) return 'N/A';
  return `$${amount.toFixed(2)}`;
};

/**
 * Export submission data to Excel
 */
export const exportToExcel = (submissions: SubmissionData, timeRange: string): void => {
  // Prepare data for Excel
  const data = submissions.map(sub => ({
    Date: formatDate(sub.created_at),
    Location: sub.location || 'N/A',
    Name: sub.name || 'N/A',
    Email: sub.email || 'N/A',
    Phone: sub.phone || 'N/A',
    'Garage Capacity': `${sub.garage_capacity || 'N/A'}-Car`,
    'Garage Finish': sub.garage_finish || 'N/A',
    'Stem Walls': sub.need_stem_walls || 'N/A',
    'Stem Wall Type': sub.stem_wall_type || 'N/A',
    'Steps': sub.need_steps || 'N/A',
    'Extra Footage': sub.need_extra_footage || 'N/A',
    'Footage Amount': sub.extra_footage || 'N/A',
    'Current Condition': sub.current_condition || 'N/A',
    'Total Price': formatCurrency(sub.total_price),
    'Payment Status': sub.payment_status || 'Unknown'
  }));
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
  
  // Auto size columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 12) }));
  worksheet['!cols'] = colWidths;
  
  // Export to Excel
  XLSX.writeFile(workbook, `submissions_${timeRange}.xlsx`);
};

/**
 * Export submission data to CSV
 */
export const exportToCSV = (submissions: SubmissionData, timeRange: string): void => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add header row
  csvContent += "Date,Location,Name,Email,Phone,Garage Capacity,Garage Finish,Stem Walls,Stem Wall Type,Steps,Extra Footage,Footage Amount,Current Condition,Total Price,Payment Status\n";
  
  // Add data rows
  submissions.forEach(sub => {
    csvContent += `"${formatDate(sub.created_at)}",`;
    csvContent += `"${sub.location || 'N/A'}",`;
    csvContent += `"${sub.name || 'N/A'}",`;
    csvContent += `"${sub.email || 'N/A'}",`;
    csvContent += `"${sub.phone || 'N/A'}",`;
    csvContent += `"${sub.garage_capacity || 'N/A'}-Car",`;
    csvContent += `"${sub.garage_finish || 'N/A'}",`;
    csvContent += `"${sub.need_stem_walls || 'N/A'}",`;
    csvContent += `"${sub.stem_wall_type || 'N/A'}",`;
    csvContent += `"${sub.need_steps || 'N/A'}",`;
    csvContent += `"${sub.need_extra_footage || 'N/A'}",`;
    csvContent += `"${sub.extra_footage || 'N/A'}",`;
    csvContent += `"${sub.current_condition || 'N/A'}",`;
    csvContent += `"${formatCurrency(sub.total_price)}",`;
    csvContent += `"${sub.payment_status || 'Unknown'}"\n`;
  });
  
  // Create and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `submissions_${timeRange}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
};

/**
 * Export submission data to PDF using pdf-lib (secure alternative to jspdf)
 */
export const exportToPDF = async (submissions: SubmissionData, timeRange: string): Promise<void> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pageWidth = 842; // A4 landscape width
    const pageHeight = 595; // A4 landscape height
    const margin = 40;
    const lineHeight = 14;
    const headerColor = rgb(0.1, 0.2, 0.45);
    
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;
    
    // Add title
    page.drawText('User Submissions Report', {
      x: margin,
      y: yPosition,
      size: 18,
      font: helveticaBoldFont,
      color: headerColor
    });
    yPosition -= 25;
    
    // Add metadata
    page.drawText(`Time Range: ${timeRange}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });
    yPosition -= 15;
    
    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });
    yPosition -= 25;
    
    // Column headers
    const columns = [
      { header: 'Date', width: 70 },
      { header: 'Name', width: 100 },
      { header: 'Location', width: 60 },
      { header: 'Garage', width: 50 },
      { header: 'Extra Footage', width: 80 },
      { header: 'Condition', width: 80 },
      { header: 'Price', width: 60 },
      { header: 'Status', width: 70 }
    ];
    
    // Draw header row
    let xPosition = margin;
    page.drawRectangle({
      x: margin,
      y: yPosition - 12,
      width: pageWidth - 2 * margin,
      height: 16,
      color: headerColor
    });
    
    columns.forEach(col => {
      page.drawText(col.header, {
        x: xPosition + 2,
        y: yPosition - 8,
        size: 8,
        font: helveticaBoldFont,
        color: rgb(1, 1, 1)
      });
      xPosition += col.width;
    });
    yPosition -= 20;
    
    // Draw data rows
    submissions.forEach((sub, index) => {
      // Check if we need a new page
      if (yPosition < margin + 30) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
      
      // Alternate row background
      if (index % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: yPosition - 10,
          width: pageWidth - 2 * margin,
          height: lineHeight,
          color: rgb(0.95, 0.95, 0.95)
        });
      }
      
      const rowData = [
        formatDate(sub.created_at),
        (sub.name || 'N/A').substring(0, 15),
        sub.location || 'N/A',
        `${sub.garage_capacity || 'N/A'}-Car`,
        sub.need_extra_footage === 'yes' ? `Yes (${sub.extra_footage || 'N/A'})` : 'No',
        (sub.current_condition || 'N/A').substring(0, 12),
        formatCurrency(sub.total_price),
        sub.payment_status || 'Unknown'
      ];
      
      xPosition = margin;
      rowData.forEach((text, colIndex) => {
        page.drawText(text.substring(0, 20), {
          x: xPosition + 2,
          y: yPosition - 6,
          size: 7,
          font: helveticaFont,
          color: rgb(0, 0, 0)
        });
        xPosition += columns[colIndex].width;
      });
      
      yPosition -= lineHeight;
    });
    
    // Save and download PDF
    const pdfBytes = await pdfDoc.save();
    // Convert Uint8Array to ArrayBuffer for Blob compatibility
    const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `submissions_${timeRange}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
};
