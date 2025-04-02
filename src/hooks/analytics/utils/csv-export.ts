
/**
 * Generate and download detailed visits CSV
 */
export const downloadDetailedVisitCSV = (detailedVisitData: any[], timeRange: string): void => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Visitors,Submissions,Conversion Rate,Avg Time\n";
  
  detailedVisitData.forEach(row => {
    csvContent += `${row.date},${row.visitors},${row.submissions},${row.convRate},${row.avgTime}\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `analytics_data_${timeRange}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate and download page visits CSV
 */
export const downloadPageVisitCSV = (pageVisitDetails: any[], timeRange: string): void => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Page,Visits,Percentage,Average Time on Page,First Visit,Last Visit\n";
  
  pageVisitDetails.forEach(row => {
    csvContent += `"${row.page}",${row.visits},${row.percentage},"${row.avgTimeOnPage}","${row.firstVisit}","${row.lastVisit}"\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `page_visits_${timeRange}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
};
