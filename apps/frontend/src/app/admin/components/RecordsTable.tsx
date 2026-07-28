'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';

export interface RecordsTableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface RecordsTableProps {
  readonly title: string;
  readonly records: Record<string, any>[];
  readonly columns: RecordsTableColumn[];
  readonly loading?: boolean;
}

export default function RecordsTable({
  title,
  records,
  columns,
  loading = false,
}: Readonly<RecordsTableProps>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = records;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        columns.some((c) => String(r[c.key]).toLowerCase().includes(q))
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (typeof aVal === 'string') {
          return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }

        return sortDesc ? bVal - aVal : aVal - bVal;
      });
    }

    return result;
  }, [records, search, sortKey, sortDesc, columns]);

  const handleExportCSV = () => {
    const headers = columns.map((c) => c.label).join(',');
    const rows = filtered.map((r) =>
      columns
        .map((c) => {
          const val = r[c.key];
          const str = String(val ?? '');
          return `"${str.replaceAll('"', '""')}"`;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            margin: 0,
            color: '#222',
          }}
        >
          {title}
        </h3>
        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#f5f5f5',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Search records..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr
              style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => {
                    if (sortKey === col.key) {
                      setSortDesc(!sortDesc);
                    } else {
                      setSortKey(col.key);
                      setSortDesc(false);
                    }
                  }}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#555',
                    cursor: 'pointer',
                    width: col.width,
                    userSelect: 'none',
                    background: sortKey === col.key ? '#f0f0f0' : undefined,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <>
                        {sortDesc ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronUp size={14} />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  {search ? 'No results found' : 'No records yet'}
                </td>
              </tr>
            )}
            {!loading &&
              filtered.length > 0 &&
              filtered.map((record, idx) => (
                <tr
                  key={record.id || idx}
                  style={{
                    borderBottom: '1px solid #eee',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '12px',
                        color: '#333',
                        width: col.width,
                      }}
                    >
                      {formatCellValue(record[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'right',
        }}
      >
        Showing {filtered.length} of {records.length} records
      </div>
    </div>
  );
}

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
