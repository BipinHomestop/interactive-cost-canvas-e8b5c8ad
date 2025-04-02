
// Export all processors from a single file for easier imports

// Visitor processors
export {
  processDailyVisitorsData,
  processPopularPagesData,
  processHourlyActivityData,
  processWeeklyHeatMapData,
  determineMostPopularPage
} from './visitor-processors';

// Conversion processors
export {
  calculateCompletionRate,
  processConversionFunnelData,
  processMonthlyTrendData
} from './conversion-processors';

// Submission processors
export {
  countSubmissionsByStatus,
  processMonthlySubmissionData,
  processDetailedSubmissionData
} from './submission-processors';

// Page visit processors
export {
  processPageVisitDetails
} from './page-visit-processors';

// Detail processors
export {
  processDetailedVisitData
} from './detail-processors';
