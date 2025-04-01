import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';

/**
 * Deletes all Firestore data related to a user
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    // 1. Delete all user's assessments
    const assessmentsRef = collection(db, 'assessments');
    const assessmentsQuery = query(assessmentsRef, where('userId', '==', userId));
    const assessmentsSnapshot = await getDocs(assessmentsQuery);

    const assessmentDeletePromises = assessmentsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(assessmentDeletePromises);

    // 2. Get user document to find username
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // 3. Delete username document if it exists
      if (userData.username) {
        await deleteDoc(doc(db, 'usernames', userData.username));
      }

      // 4. Delete the user document itself
      await deleteDoc(doc(db, 'users', userId));
    }

    // 5. Delete the Firebase Auth account via API
    const response = await fetch('/api/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete auth record');
    }

    return;
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}
