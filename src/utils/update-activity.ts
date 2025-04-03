import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

/**
 * Updates the user's lastActive timestamp and ensures their status is active
 * Activities that update lastActive:
 * - Login
 * - Starting a scan assessment
 * - Updating profile (name, NIM, phone)
 * - Logging out
 */
export async function updateUserActivity(userId: string): Promise<void> {
  if (!userId) return;

  try {
    const userRef = doc(db, 'users', userId);

    // First check current status
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Always update lastActive and ensure status is active
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
        status: 'active', // Always set to active when there's activity
      });

      // If user was inactive, log that they're reactivated
      if (userData.status === 'inactive') {
        console.log(`User ${userId} was inactive, now reactivated`);
      }
    }
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
}
