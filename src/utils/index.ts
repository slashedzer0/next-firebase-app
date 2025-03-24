// Export utility functions
export { cn } from "./styling";
export { generateUsername } from "./username";

// Export route protection components
export {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "@/components/auth/route-protection";
export { AdminRoute } from "@/components/auth/route-admin";
export { UserRoute } from "@/components/auth/route-student";
