'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import RecordsTable, { RecordsTableColumn } from '../components/RecordsTable';

const columns: RecordsTableColumn[] = [
  { key: 'email', label: 'Email', width: '280px' },
  { key: 'name', label: 'Name' },
  { key: 'newsletter_subscribed', label: 'Newsletter' },
  { key: 'created_at', label: 'Joined' },
];

export default function MembersView() {
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.get('/members/');
        setRecords(data as Record<string, any>[]);
      } catch (err) {
        console.error('Failed to load members', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <RecordsTable
      title="Members"
      records={records}
      columns={columns}
      loading={loading}
    />
  );
}
