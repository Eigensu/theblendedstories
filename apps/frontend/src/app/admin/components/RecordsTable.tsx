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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-lg font-semibold text-white">{title}</h3>
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
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
        className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-500"
      />

      {/* Panel shell matches the section editors: #111111 on the page's black,
          rounded-2xl, hairline border. */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#111111]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
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
                  style={{ width: col.width }}
                  className={`cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white ${
                    sortKey === col.key ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
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
                  className="px-4 py-10 text-center text-zinc-500"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-zinc-500"
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
                  className="border-b border-zinc-800/60 transition-colors last:border-b-0 hover:bg-zinc-900/60"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ width: col.width }}
                      className="px-4 py-3 text-zinc-300"
                    >
                      {formatCellValue(record[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xs text-zinc-500">
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
