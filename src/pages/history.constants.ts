export const HISTORY_ROUTES = {
  dashboard: '/dashboard',
} as const;

export const HISTORY_LOG_MESSAGES = {
  loadFailure: 'Failed to load history:',
  deleteFailure: 'Failed to delete assessment:',
} as const;

export const HISTORY_ALERT_MESSAGES = {
  deleteConfirm: 'Are you sure you want to delete this assessment? This action cannot be undone.',
  deleteFailure: 'Failed to delete assessment. Please try again.',
} as const;

export const HISTORY_TEXT = {
  backToDashboard: 'Back to Dashboard',
  title: 'Assessment History',
  subtitle: 'View all your previous damage assessments',
  loading: 'Loading your history...',
  totalAssessments: 'Total Assessments',
  totalCost: 'Total Cost',
  totalLossCases: 'Total Loss Cases',
  emptyTitle: 'No history yet',
  emptyText: 'Upload crash images to start building your assessment history',
  goToDashboard: 'Go to Dashboard',
  totalLoss: 'Total Loss',
  repairable: 'Repairable',
  deleteAssessmentTitle: 'Delete assessment',
  totalCostLabel: 'Total Cost',
  damagedPartsLabel: 'Damaged Parts',
  assessmentNotAvailable: 'Assessment not available',
  levelPrefix: 'Lvl ',
} as const;

export const HISTORY_CLASS_KEYS = {
  severityPrefix: 'severity',
} as const;
