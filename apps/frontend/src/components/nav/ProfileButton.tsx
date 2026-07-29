'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import RegisterModal from '../auth/RegisterModal';
import NavButton from './NavButton';
import { hasHamburger } from './navSlots';

export default function ProfileButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const slot = hasHamburger(pathname) ? 1 : 0;

  return (
    <>
      <NavButton
        slot={slot}
        open={open}
        onClick={() => setOpen(true)}
        ariaLabel="Account"
      >
        <User size={18} strokeWidth={1.5} />
      </NavButton>

      {open && <RegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}
