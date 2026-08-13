'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_LOCATION_MAIN,
  DEFAULT_LOCATION_SUB,
} from '@/constants/locationTaxonomy';

import { LOCATION_MAIN_COOKIE, LOCATION_SUB_COOKIE, COOKIE_MAX_AGE } from '@/constants/cookies';

type LocationContextValue = {
  locationMain: string;
  locationSub: string;
  setLocation: (locationMain: string, locationSub: string) => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

/**
 * The visitor's chosen city, mirrored into a cookie so server components (the
 * homepage, listing pages) can read the same value on the next request and filter
 * their article fetches by it — a plain client Context alone would not reach them.
 *
 * Initial state reads the cookie set by the previous request (see the server
 * layout, which seeds it if absent) so there is no flash from default to chosen
 * city on load.
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [locationMain, setLocationMain] = useState(
    () => readCookie(LOCATION_MAIN_COOKIE) || DEFAULT_LOCATION_MAIN
  );
  const [locationSub, setLocationSub] = useState(
    () => readCookie(LOCATION_SUB_COOKIE) || DEFAULT_LOCATION_SUB
  );

  const setLocation = useCallback((nextMain: string, nextSub: string) => {
    writeCookie(LOCATION_MAIN_COOKIE, nextMain);
    writeCookie(LOCATION_SUB_COOKIE, nextSub);
    setLocationMain(nextMain);
    setLocationSub(nextSub);
    // The selection only takes visible effect after a fresh request, and we
    // send the reader directly to the stories archive to see the new city's content.
    window.location.href = '/stories';
  }, []);

  const value = useMemo(
    () => ({ locationMain, locationSub, setLocation }),
    [locationMain, locationSub, setLocation]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
