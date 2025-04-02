import { create } from 'zustand';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { AssessmentResultItem } from '@/types/dashboard';

interface ResultsState {
  assessments: AssessmentResultItem[];
  loading: boolean;
}

interface ResultsActions {
  fetchUserAssessments: (userId: string) => Promise<void>;
}

type ResultsStore = ResultsState & ResultsActions;

export const useResultsStore = create<ResultsStore>((set) => ({
  assessments: [],
  loading: true,

  fetchUserAssessments: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true });

      // Query assessments for the current user
      const assessmentsRef = collection(db, 'assessments');
      const q = query(assessmentsRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);

      // Process the results and sort in memory
      const unsortedResults: Array<{
        data: DocumentData;
        id: string;
      }> = [];

      querySnapshot.forEach((doc) => {
        unsortedResults.push({
          data: doc.data(),
          id: doc.id,
        });
      });

      // Sort by createdAt timestamp (oldest first)
      unsortedResults.sort((a, b) => {
        // First try to sort by createdAt timestamp
        const timestampA = a.data.createdAt?.toMillis?.();
        const timestampB = b.data.createdAt?.toMillis?.();

        if (timestampA && timestampB) {
          return timestampA - timestampB; // Ascending order (oldest first)
        }

        // Fallback to date string if createdAt is not available
        const dateA = a.data.date?.split('-')?.reverse()?.join('-') || '';
        const dateB = b.data.date?.split('-')?.reverse()?.join('-') || '';
        return dateA.localeCompare(dateB); // Ascending order (oldest first)
      });

      // Create the assessment data with correct numbering (oldest is #1)
      const assessmentData: AssessmentResultItem[] = unsortedResults.map((item, index) => ({
        id: String(index + 1), // Sequential numbering (oldest is #1)
        level: item.data.stressLevel || 'unknown',
        confidence: item.data.confidence || 0,
        date: item.data.date || 'N/A',
      }));

      // Reverse the array so newest (highest number) appears first in table
      set({
        assessments: assessmentData.reverse(),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching assessments:', error);
      set({ loading: false });
    }
  },
}));
