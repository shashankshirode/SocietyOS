import React from 'react';
import { StickyFooter } from '../layout/StickyFooter';
import { ResponsiveStack } from '../layout/ResponsiveStack';

export function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <StickyFooter>
      <ResponsiveStack direction="row" smallPhoneDirection="column">
        {children}
      </ResponsiveStack>
    </StickyFooter>
  );
}
