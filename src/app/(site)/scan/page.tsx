import { ScanMain } from './_components/scan-main';
import { AdminRestrictedRoute } from '@/middleware/route-protection';

export default function Page() {
  return (
    <AdminRestrictedRoute>
      <ScanMain />
    </AdminRestrictedRoute>
  );
}
