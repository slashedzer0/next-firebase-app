// Export utility functions
export { cn } from "./styling";
export { generateUsername } from "./username";
export { calculateCF } from "./certainty-factor";
export { saveAssessmentResult } from "./save-assessment";
export { incrementAssessmentCount } from "./count-assessment";
export { updateUserActivity } from "./update-activity";
export { deleteUserData } from "./delete-user";

// Export route protection components
export {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "@/components/auth/route-protection";
export { AdminRoute } from "@/components/auth/route-admin";
export { UserRoute } from "@/components/auth/route-student";
