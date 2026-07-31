'use client';

import type { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MemberProvider } from '@/contexts/MemberContext';
import { LocationProvider } from '@/contexts/LocationContext';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Client-side providers for the public site.
 *
 * `GoogleOAuthProvider` injects Google's script tag, so it is skipped entirely
 * when no client ID is configured — otherwise every page load on a machine
 * without credentials fetches a script that can only fail. The rest of the app
 * still works signed-out, and RegisterModal shows a "not configured" notice.
 */
export default function AuthProviders({ children }: { children: ReactNode }) {
  if (!CLIENT_ID) {
    return (
      <MemberProvider>
        <LocationProvider>{children}</LocationProvider>
      </MemberProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <MemberProvider>
        <LocationProvider>{children}</LocationProvider>
      </MemberProvider>
    </GoogleOAuthProvider>
  );
}
