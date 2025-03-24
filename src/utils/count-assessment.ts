import { db } from "@/services/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function incrementAssessmentCount(userId: string): Promise<void> {
  if (!userId) return;
  
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      assessmentCount: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing assessment count:", error);
  }
}
