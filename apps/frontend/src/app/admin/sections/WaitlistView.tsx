'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import RecordsTable, { RecordsTableColumn } from '../components/RecordsTable';

const columns: RecordsTableColumn[] = [
  { key: 'email', label: 'Email', width: '220px' },
  { key: 'fullName', label: 'Name', width: '160px' },
  { key: 'city', label: 'City', width: '120px' },
  { key: 'profession', label: 'Profession', width: '150px' },
  { key: 'updates', label: 'Updates' },
  { key: 'created_at', label: 'Applied' },
];

export default function WaitlistView() {
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.get('/tbs-nights/waitlist');
        setRecords(data as Record<string, any>[]);
      } catch (err) {
        console.error('Failed to load waitlist', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <RecordsTable
      title="TBS Nights Waitlist"
      records={records}
      columns={columns}
      loading={loading}
    />
  );
}
