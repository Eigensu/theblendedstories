'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import RecordsTable, { RecordsTableColumn } from '../components/RecordsTable';

type CrmViewConfig = {
  title: string;
  /** Admin-only read endpoint backing this table. */
  endpoint: string;
  columns: RecordsTableColumn[];
};

/**
 * The three CRM tables differ only in their title, endpoint and columns, so they
 * share one component keyed by the section id the dashboard already passes in.
 * Adding a fourth read-only table means adding an entry here plus one in
 * `config.tsx` — no new component.
 */
export const CRM_VIEWS: Record<string, CrmViewConfig> = {
  members: {
    title: 'Members',
    endpoint: '/members/',
    columns: [
      { key: 'email', label: 'Email', width: '280px' },
      { key: 'name', label: 'Name' },
      { key: 'newsletter_subscribed', label: 'Newsletter' },
      { key: 'created_at', label: 'Joined' },
    ],
  },
  subscribers: {
    title: 'Newsletter Subscribers',
    endpoint: '/newsletter/subscribers',
    columns: [
      { key: 'email', label: 'Email', width: '280px' },
      { key: 'source', label: 'Source' },
      { key: 'subscribed_at', label: 'Subscribed' },
    ],
  },
  waitlist: {
    title: 'TBS Nights Waitlist',
    endpoint: '/tbs-nights/waitlist',
    columns: [
      { key: 'email', label: 'Email', width: '220px' },
      { key: 'fullName', label: 'Name', width: '160px' },
      { key: 'city', label: 'City', width: '120px' },
      { key: 'profession', label: 'Profession', width: '150px' },
      { key: 'updates', label: 'Updates' },
      { key: 'created_at', label: 'Applied' },
    ],
  },
};

export default function CrmView({
  sectionId,
}: Readonly<{ sectionId: string }>) {
  const view = CRM_VIEWS[sectionId];
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!view) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .get(view.endpoint)
      .then((data) => {
        if (!cancelled) setRecords(data as Record<string, any>[]);
      })
      .catch((err) => {
        // Without this the table would render its empty state, which reads as
        // "nobody has signed up" rather than "the request failed".
        console.error(`Failed to load ${view.title}`, err);
        if (!cancelled) {
          setRecords([]);
          setError(err?.message || 'Could not load these records.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view]);

  if (!view) {
    return <div className="p-8 text-center text-zinc-500">Unknown section</div>;
  }

  return (
    <>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-400"
        >
          {error}
        </div>
      )}
      <RecordsTable
        title={view.title}
        records={records}
        columns={view.columns}
        loading={loading}
      />
    </>
  );
}
