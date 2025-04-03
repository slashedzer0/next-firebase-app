import { ScanMain } from './_components/scan-main';
import { AdminRestrictedRoute } from '@/middleware/route-protection';
import { scanQuestions } from '@/types/questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan Assessment',
};

// Re-export questions for backward compatibility
export const questions = scanQuestions;

export default function Page() {
  return (
    <AdminRestrictedRoute>
      <ScanMain />
    </AdminRestrictedRoute>
  );
}
