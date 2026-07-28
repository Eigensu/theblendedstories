'use client';

import React, { forwardRef } from 'react';
import { NAV_BUTTON_STYLE, navSlotRight } from './navSlots';

export interface NavButtonProps {
  slot: number;
  open: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ slot, open, onClick, ariaLabel, children, style }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={open}
      style={{
        ...NAV_BUTTON_STYLE,
        right: navSlotRight(slot),
        display: open ? 'none' : 'flex',
        ...style,
      }}
    >
      {children}
    </button>
  )
);

NavButton.displayName = 'NavButton';

export default NavButton;
