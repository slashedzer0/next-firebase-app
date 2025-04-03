import { create } from 'zustand';
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { AdminUserData, RecentAssessment, ReportData, UserDetails } from '@/types/admin';
import { deleteUserData } from '@/utils/delete-user';

type ChartDataItem = {
  month: string;
  monthYear: string;
  highest: number;
  lowest: number;
  hasData: boolean;
};

interface AdminStoreState {
  // Dashboard overview
  recentAssessments: RecentAssessment[];
  highRiskCount: number;
  activeStudentsCount: number;
  averageConfidence: { score: number; change: number };
  chartData: ChartDataItem[];
  loadingDashboard: boolean;

  // Reports page
  reports: ReportData[];
  loadingReports: boolean;

  // User details dialog
  userDetails: UserDetails | null;
  loadingUserDetails: boolean;

  // Users page
  users: AdminUserData[];
  loadingUsers: boolean;
  isDeleting: boolean;

  // Selected items for dialogs
  selectedReportId: string | null;
  selectedUser: { id: string; fullName: string; email: string } | null;
}

interface AdminStoreActions {
  fetchDashboardData: () => Promise<void>;
  fetchReports: () => Promise<void>;
  deleteReport: (id: string) => Promise<boolean>;
  fetchUserDetails: (userId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string, userName: string) => Promise<boolean>;
  setSelectedReportId: (id: string | null) => void;
  setSelectedUser: (user: { id: string; fullName: string; email: string } | null) => void;
}

type AdminStore = AdminStoreState & AdminStoreActions;

export const useAdminStore = create<AdminStore>((set) => ({
  // Initial state
  recentAssessments: [],
  highRiskCount: 0,
  activeStudentsCount: 0,
  averageConfidence: { score: 0, change: 0 },
  chartData: [],
  loadingDashboard: false,
  reports: [],
  loadingReports: false,
  userDetails: null,
  loadingUserDetails: false,
  users: [],
  loadingUsers: false,
  isDeleting: false,
  selectedReportId: null,
  selectedUser: null,

  // Actions
  fetchDashboardData: async () => {
    try {
      set({ loadingDashboard: true });

      // Fetch active students count
      const usersRef = collection(db, 'users');
      const activeStudentsQuery = query(
        usersRef,
        where('role', '==', 'student'),
        where('status', '==', 'active')
      );

      const activeStudentsSnapshot = await getDocs(activeStudentsQuery);
      set({ activeStudentsCount: activeStudentsSnapshot.size });

      // Create a query to get assessments
      // Fetch assessments but not used since we're using placeholder data
      const assessmentsRef = collection(db, 'assessments');
      const assessmentsQuery = query(assessmentsRef, limit(1000));
      await getDocs(assessmentsQuery);

      // Process chart data with current date information
      const now = new Date();
      const currentMonth = now.getMonth();

      // Generate chart data with 6 months
      const chartData: ChartDataItem[] = [];

      for (let i = 5; i >= 0; i--) {
        let monthIndex = currentMonth - i;

        // Handle previous year if month goes negative
        if (monthIndex < 0) {
          monthIndex += 12;
        }

        // Get month name
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const monthName = monthNames[monthIndex];

        // Add to chart data array with placeholder values
        chartData.push({
          month: monthName,
          monthYear: monthName.slice(0, 3),
          highest: 75 + Math.floor(Math.random() * 15), // Placeholder
          lowest: 35 + Math.floor(Math.random() * 15), // Placeholder
          hasData: true,
        });
      }

      // Also fetch recent assessments
      const recentQuery = query(
        collection(db, 'assessments'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(recentQuery);
      const assessmentsWithUserData: RecentAssessment[] = [];

      // Process up to 3 student assessments for the recent list
      let processedCount = 0;
      for (const assessmentDoc of querySnapshot.docs) {
        if (processedCount >= 3) break;

        const assessmentData = assessmentDoc.data();
        const userId = assessmentData.userId;

        if (!userId) continue;

        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.role === 'student') {
              assessmentsWithUserData.push({
                id: assessmentDoc.id,
                userName: userData.fullName || 'Unknown User',
                userEmail: userData.email || 'no-email@example.com',
                confidence: assessmentData.confidence || 0,
              });

              processedCount++;
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      // Calculate high risk count (placeholder)
      const highRiskCount = Math.floor(Math.random() * 3) + 1;

      set({
        recentAssessments: assessmentsWithUserData,
        chartData,
        highRiskCount,
        loadingDashboard: false,
        averageConfidence: { score: 75, change: 5 },
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ loadingDashboard: false });
    }
  },

  fetchReports: async () => {
    try {
      set({ loadingReports: true });

      // Fetch assessments from Firestore
      const assessmentsRef = collection(db, 'assessments');
      const assessmentsQuery = query(assessmentsRef, limit(100));
      const assessmentsSnapshot = await getDocs(assessmentsQuery);

      // Process assessments and fetch user data
      const reportData: ReportData[] = [];

      for (const assessmentDoc of assessmentsSnapshot.docs) {
        const assessmentData = assessmentDoc.data();
        const userId = assessmentData.userId;

        if (!userId) continue;

        // Get user data to display name
        let userName = 'Unknown User';
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Extract first name from full name
            const fullName = userData.fullName || '';
            userName = fullName.split(' ')[0] || 'Unknown';
          }
        } catch (error) {
          console.error(`Error fetching user data for ${userId}:`, error);
        }

        reportData.push({
          id: assessmentDoc.id,
          userId,
          userName,
          level: assessmentData.stressLevel || 'unknown',
          confidence: assessmentData.confidence || 0,
          date: assessmentData.date || '',
        });
      }

      // Sort by date (most recent first)
      reportData.sort((a, b) => {
        if (!a.date || !b.date) return 0;

        try {
          // Convert DD-MM-YYYY to sortable format
          const dateA = a.date.split('-').reverse().join('-');
          const dateB = b.date.split('-').reverse().join('-');
          return dateB.localeCompare(dateA);
        } catch (error) {
          console.error('Error sorting dates:', error);
          return 0;
        }
      });

      set({ reports: reportData, loadingReports: false });
    } catch (error) {
      console.error('Error fetching reports:', error);
      set({ loadingReports: false });
    }
  },

  deleteReport: async (id) => {
    try {
      await deleteDoc(doc(db, 'assessments', id));

      // Update state
      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
      }));

      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      return false;
    }
  },

  fetchUserDetails: async (userId) => {
    try {
      set({ loadingUserDetails: true });

      if (!userId) {
        set({
          userDetails: {
            email: 'Invalid user ID',
            nim: '-',
            phone: '-',
          },
          loadingUserDetails: false,
        });
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          userDetails: {
            email: userData.email || '-',
            nim: userData.nim || '-',
            phone: userData.phone || '-',
          },
        });
      } else {
        set({
          userDetails: {
            email: 'User not found',
            nim: 'User not found',
            phone: 'User not found',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      set({
        userDetails: {
          email: 'Error loading data',
          nim: 'Error loading data',
          phone: 'Error loading data',
        },
      });
    } finally {
      set({ loadingUserDetails: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ loadingUsers: true });

      // Get student users from Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'student'));
      const querySnapshot = await getDocs(q);

      const userData: AdminUserData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userData.push({
          id: doc.id,
          fullName: data.fullName || '',
          status: data.status || 'active',
          nim: data.nim || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      });

      set({ users: userData, loadingUsers: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loadingUsers: false });
    }
  },

  deleteUser: async (userId) => {
    if (!userId) return false;

    try {
      set({ isDeleting: true });

      // Delete all user data and auth account
      await deleteUserData(userId);

      // Update UI by filtering out the deleted user
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));

      set({ isDeleting: false });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      set({ isDeleting: false });
      return false;
    }
  },

  setSelectedReportId: (id) => set({ selectedReportId: id }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
