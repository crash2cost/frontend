export const HISTORY_ROUTES = {
  dashboard: '/dashboard',
} as const;

export const HISTORY_LOG_MESSAGES = {
  loadFailure: 'Failed to load history:',
  deleteFailure: 'Failed to delete assessment:',
} as const;

export const HISTORY_ALERT_MESSAGES = {
  deleteConfirm: 'Delete this assessment and its image? This action cannot be undone.',
  deleteSelectedConfirm: 'Delete selected assessments and images? This action cannot be undone.',
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
  deleteAssessmentTitle: 'Delete assessment and image',
  selectAssessment: 'Select assessment',
  deleteSelected: 'Delete Selected',
  selectAll: 'Select All',
  clearSelection: 'Clear Selection',
  selectedCount: 'selected',
  totalCostLabel: 'Total Cost',
  damagedPartsLabel: 'Damaged Parts',
  assessmentNotAvailable: 'Assessment not available',
  levelPrefix: 'Lvl ',
  adminSubtitle: 'View all system damage assessments',
  adminBadge: 'Admin View',
  adminEmptyTitle: 'No assessments in system',
  adminEmptyText: 'No damage assessments have been submitted yet',
  ownerLabel: 'Owner',
} as const;

export const HISTORY_CLASS_KEYS = {
  severityPrefix: 'severity',
} as const;
