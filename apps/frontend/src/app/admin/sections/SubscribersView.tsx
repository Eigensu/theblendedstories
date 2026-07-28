'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import RecordsTable, { RecordsTableColumn } from '../components/RecordsTable';

const columns: RecordsTableColumn[] = [
  { key: 'email', label: 'Email', width: '280px' },
  { key: 'source', label: 'Source' },
  { key: 'subscribed_at', label: 'Subscribed' },
];

export default function SubscribersView() {
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.get('/newsletter/subscribers');
        setRecords(data as Record<string, any>[]);
      } catch (err) {
        console.error('Failed to load subscribers', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <RecordsTable
      title="Newsletter Subscribers"
      records={records}
      columns={columns}
      loading={loading}
    />
  );
}
