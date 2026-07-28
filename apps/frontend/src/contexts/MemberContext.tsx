'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  clearTokens,
  getStoredTokens,
  memberApi,
  storeTokens,
  type Member,
} from '@/services/memberApi';

type MemberContextValue = {
  member: Member | null;
  /** True until the stored session has been checked, so the UI can avoid flicker. */
  loading: boolean;
  signInWithCode: (code: string) => Promise<Member>;
  signOut: () => void;
};

const MemberContext = createContext<MemberContextValue | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore a session on mount. A stored token may be expired, in which case
  // memberApi refreshes it transparently; if that fails too, getMe throws and
  // we fall back to signed out.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!getStoredTokens().access) {
        setLoading(false);
        return;
      }
      try {
        const me = await memberApi.getMe();
        if (!cancelled) setMember(me);
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithCode = useCallback(async (code: string) => {
    const result = await memberApi.signInWithGoogle(code);
    storeTokens(result.access_token, result.refresh_token);
    setMember(result.user);
    return result.user;
  }, []);

  const signOut = useCallback(() => {
    clearTokens();
    setMember(null);
  }, []);

  const value = useMemo(
    () => ({ member, loading, signInWithCode, signOut }),
    [member, loading, signInWithCode, signOut]
  );

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}
