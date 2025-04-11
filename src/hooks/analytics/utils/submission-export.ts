
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
 * Export submission data to PDF
 */
export const exportToPDF = (submissions: SubmissionData, timeRange: string): void => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('User Submissions Report', 14, 22);
    
    // Add period
    doc.setFontSize(12);
    doc.text(`Time Range: ${timeRange}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);
    
    // Create simpler column headers
    const tableColumn = [
      "Date", "Name", "Location", "Garage", "Price", "Status"
    ];
    
    // Simplify data rows for better fitting on PDF
    const tableRows = submissions.map(sub => [
      formatDate(sub.created_at),
      sub.name || 'N/A',
      sub.location || 'N/A',
      `${sub.garage_capacity || 'N/A'}-Car`,
      formatCurrency(sub.total_price),
      sub.payment_status || 'Unknown'
    ]);
    
    // @ts-ignore - jsPDF-autotable adds this method
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      },
      headStyles: { fillColor: [26, 49, 116] }
    });
    
    // Save PDF
    doc.save(`submissions_${timeRange}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
};
