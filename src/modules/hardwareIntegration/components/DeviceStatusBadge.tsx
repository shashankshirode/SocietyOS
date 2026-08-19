import React from 'react';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { HardwareDeviceStatus } from '../../../shared/types/hardware.types';

export function DeviceStatusBadge({ status }: { status: HardwareDeviceStatus }) {
  return <StatusBadge moduleType="hardware" status={status} />;
}
