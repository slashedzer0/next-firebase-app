import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

/**
 * Checks for and updates user statuses:
 * - Active users who haven't been active for 30+ days become inactive
 * - This runs automatically on app initialization and daily thereafter
 */
export async function checkAndUpdateUserStatuses(): Promise<void> {
  try {
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Query for student accounts with lastActive older than 30 days and status still 'active'
    // Process in batches to avoid overloading the client
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'student'),
      where('status', '==', 'active'),
      where('lastActive', '<', Timestamp.fromDate(thirtyDaysAgo)),
      limit(50) // Process 50 at a time
    );

    const querySnapshot = await getDocs(q);

    // Process each inactive account
    const promises = querySnapshot.docs.map(async (document) => {
      try {
        await updateDoc(doc(db, 'users', document.id), {
          status: 'inactive',
        });
        console.log(`Set user ${document.id} to inactive due to 30+ days of inactivity`);
      } catch (err) {
        console.error(`Error updating user ${document.id}:`, err);
      }
    });

    await Promise.all(promises);

    if (querySnapshot.docs.length > 0) {
      console.log(`Updated ${querySnapshot.docs.length} inactive users`);
    }
  } catch (error) {
    console.error('Error checking inactive accounts:', error);
  }
}
