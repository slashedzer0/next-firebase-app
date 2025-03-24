import { db } from "@/services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Answer, AssessmentResult } from "@/types/assessment";
import { Assessment, assessmentSchema } from "@/schemas/assessment";

export async function saveAssessmentResult(
  userId: string | null,
  answers: Answer[],
  result: AssessmentResult
): Promise<string> {
  try {
    // Check if user is authenticated
    if (!userId) {
      throw new Error("Authentication required to save assessment results");
    }

    // Format date as DD-MM-YYYY
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    // Create assessment object with our schema
    const assessment: Assessment = {
      userId,
      stressLevel: result.stressLevel,
      confidence: result.confidence,
      answers,
      date: formattedDate, // Store as DD-MM-YYYY string
      day: now.toLocaleDateString("en-US", { weekday: "long" }),
      createdAt: serverTimestamp(), // Add serverTimestamp for precise ordering
    };

    // Validate with zod schema
    assessmentSchema.parse(assessment);

    // Save to Firestore
    const docRef = await addDoc(collection(db, "assessments"), assessment);
    return docRef.id;
  } catch (error) {
    console.error("Firebase save error:", error);

    if (error instanceof Error && error.message.includes("permission")) {
      throw new Error(
        "Permission denied. Please ensure you're logged in to save results."
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("Authentication required")
    ) {
      throw new Error("Authentication required to save assessment results");
    }

    throw error; // Re-throw the error to be handled by the calling code
  }
}
