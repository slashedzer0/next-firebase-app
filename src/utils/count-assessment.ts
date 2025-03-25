import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * Increments the assessment count for a user by 1
 * Called when a user starts a new assessment
 */
export async function incrementAssessmentCount(userId: string): Promise<void> {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);

    // Check if the user document exists
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      // Use Firestore's atomic increment operation
      await updateDoc(userRef, {
        assessmentCount: increment(1),
      });

      console.log(`Assessment count incremented for user: ${userId}`);
    } else {
      console.error(`User document not found for: ${userId}`);
    }
  } catch (error) {
    console.error("Error incrementing assessment count:", error);
  }
}
