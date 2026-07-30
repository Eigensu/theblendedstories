'use client';

import React, { forwardRef } from 'react';
import { NAV_BUTTON_STYLE, navSlotRight } from './navSlots';

export interface NavButtonProps {
  slot: number;
  /**
   * Whether the overlay covers the button. Full-screen overlays hide it; a
   * dropdown anchored to the button does not, which is why `expanded` is
   * separate.
   */
  open: boolean;
  /** Value for aria-expanded. Defaults to `open`. */
  expanded?: boolean;
  onClick: () => void;
  ariaLabel: string;
  /** What the button opens. The account button switches to 'menu' once signed in. */
  ariaHasPopup?: 'dialog' | 'menu';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    {
      slot,
      open,
      expanded,
      onClick,
      ariaLabel,
      ariaHasPopup = 'dialog',
      children,
      style,
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-expanded={expanded ?? open}
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
