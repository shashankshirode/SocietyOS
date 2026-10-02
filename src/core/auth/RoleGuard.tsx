import React from 'react';
import { AccessRestrictedState } from '../../shared/feedback/AccessRestrictedState';
import { LoadingState } from '../../shared/feedback/LoadingState';
import { useAuth } from './AuthProvider';
import type { AppRole } from '../permissions/permission.types';

interface RoleGuardProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { status, isAuthenticated, userRole } = useAuth();

  if (status === 'loading') {
    return <LoadingState message="Loading..." />;
  }

  if (!isAuthenticated) {
    return fallback ?? (
      <AccessRestrictedState
        title="Please sign in"
        requiredPermission="Authentication required"
      />
    );
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return fallback ?? (
      <AccessRestrictedState
        title="Access denied"
        requiredPermission={`Required role: ${allowedRoles.join(' or ')}`}
      />
    );
  }

  return <>{children}</>;
}

export function PlatformAdminGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['SUPER_ADMIN']}>{children}</RoleGuard>;
}

export function SocietyAdminGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER']}>{children}</RoleGuard>;
}

export function ResidentGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY']}>{children}</RoleGuard>;
}