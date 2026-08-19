import { useMemo, useState } from 'react';

const verificationQueue = [
  { id: 'staff-ver-1', name: 'Ramesh Kumar', role: 'Security Guard', status: 'PENDING_VENDOR_REVIEW' },
  { id: 'staff-ver-2', name: 'Meena Patil', role: 'Domestic Help', status: 'POLICE_VERIFIED' },
];

export function useStaffVerification() {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const approve = async (staffId: string) => {
    setApprovedIds((current) => Array.from(new Set([...current, staffId])));
  };

  return useMemo(
    () => ({
      data: verificationQueue.map((item) => ({
        ...item,
        status: approvedIds.includes(item.id) ? 'VERIFIED' : item.status,
      })),
      isLoading: false,
      error: null as Error | null,
      approve,
    }),
    [approvedIds]
  );
}
