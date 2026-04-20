export const ADMIN_TEXT = {
  title: 'Admin Panel',
  subtitle: 'Manage users, view system statistics, and oversee all reports',
  adminBadge: 'Administrator',
  backToDashboard: 'Dashboard',
  logout: 'Logout',
};

export const ADMIN_TABS = {
  dashboard: 'Dashboard',
  users: 'Users',
} as const;

export type AdminTab = keyof typeof ADMIN_TABS;

export const ADMIN_STATS_TEXT = {
  totalUsers: 'Total Users',
  totalAdmins: 'Administrators',
  totalAssessments: 'Total Assessments',
  totalCost: 'Total Repair Costs',
  avgCost: 'Average Cost',
  totalLossRate: 'Total Loss Rate',
};

export const ADMIN_USERS_TEXT = {
  searchPlaceholder: 'Search by username...',
  usernameColumn: 'Username',
  emailColumn: 'Email',
  roleColumn: 'Role',
  assessmentsColumn: 'Reports',
  joinedColumn: 'Joined',
  actionsColumn: 'Actions',
  promoteToAdmin: 'Promote to Admin',
  demoteToUser: 'Demote to User',
  deleteUser: 'Delete',
  deleteConfirm: 'Are you sure you want to delete this user? This will also remove all their assessments and images.',
  selfLabel: '(you)',
  emptyTitle: 'No users found',
  emptyText: 'No users match your search criteria',
};

export const ADMIN_REPORTS_TEXT = {
  title: 'All System Reports',
  subtitle: 'View all damage assessments across the system',
  emptyTitle: 'No reports yet',
  emptyText: 'No damage assessments have been submitted yet',
  searchPlaceholder: 'Filter by username...',
  deleteConfirm: 'Are you sure you want to delete this report? This action cannot be undone.',
};

export const ADMIN_ACTIVITY_TEXT = {
  recentAssessments: 'Recent Assessments',
  recentUsers: 'Recent Users',
  noRecentAssessments: 'No recent assessments',
  noRecentUsers: 'No recent users',
};

export const ADMIN_MESSAGES = {
  roleChangeSuccess: 'User role updated successfully',
  roleChangeFailed: 'Failed to update user role',
  deleteSuccess: 'User deleted successfully',
  deleteFailed: 'Failed to delete user',
  reportDeleteSuccess: 'Report deleted successfully',
  reportDeleteFailed: 'Failed to delete report',
  loadFailed: 'Failed to load data',
};

export const ADMIN_ROUTES = {
  dashboard: '/dashboard',
};
