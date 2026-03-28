import React from 'react';
import { Loader } from '@/src/components/ui/Loader';

export default function DashboardLoading() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center">
      <Loader size={120} />
    </div>
  );
}
