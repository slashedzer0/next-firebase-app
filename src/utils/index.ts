// Export utility functions
export { cn } from './styling';
export { generateUsername } from './username';
export { calculateCF } from './certainty-factor';
export { saveAssessmentResult } from './save-assessment';
export { incrementAssessmentCount } from './count-assessment';
export { updateUserActivity } from './update-activity';
export { deleteUserData } from './delete-user';
export { shuffleArray } from './shuffle';
export { handleError, getAuthErrorMessage } from './error-handler';
export { toast } from './toast';

// Export route protection components
export { AuthenticatedRoute, UnauthenticatedRoute } from '@/middleware/route-protection';
export { AdminRoute } from '@/middleware/route-admin';
export { UserRoute } from '@/middleware/route-student';
