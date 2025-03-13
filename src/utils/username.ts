import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export const generateUsername = async (fullName: string): Promise<string> => {
  const baseUsername = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "");

  let username = baseUsername;
  let counter = 1;

  while (true) {
    const usernameDoc = await getDoc(doc(db, "usernames", username));
    if (!usernameDoc.exists()) {
      return username;
    }

    username = `${baseUsername}${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error("Unable to generate unique username");
    }
  }
};
