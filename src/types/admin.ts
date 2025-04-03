/**
 * User data for admin panel
 */
export interface AdminUserData {
  id: string;
  fullName: string;
  status: string;
  nim?: string;
  phone?: string;
  email: string;
}

/**
 * Report data for assessment reports
 */
export interface ReportData {
  id: string;
  userId: string;
  userName: string;
  level: string;
  confidence: number;
  date: string;
}

/**
 * User details for user info modal
 */
export interface UserDetails {
  email: string;
  nim: string;
  phone: string;
}

/**
 * Recent assessment data for dashboard
 */
export interface RecentAssessment {
  id: string;
  userName: string;
  userEmail: string;
  confidence: number;
}
