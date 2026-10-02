import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ActivityLog } from '../../../types/admin';

interface ActivityLogsPageProps {
  logs: ActivityLog[];
}

export const ActivityLogsPage: React.FC<ActivityLogsPageProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEntity = entityFilter === 'all' || l.entityType === entityFilter;
      return matchesSearch && matchesEntity;
    });
  }, [logs, searchQuery, entityFilter]);

  const handleExportLogs = () => {
    const header = 'ID,StaffName,Email,Action,EntityType,EntityID,Timestamp,Details,Result\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.staffName}","${l.staffEmail}","${l.action}","${l.entityType}","${l.entityId}","${l.timestamp}","${l.details.replace(/"/g, '""')}","${l.result}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshit-activity-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Immutable Administrative Audit Trail ({logs.length} events)
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographically sealed timeline of all administrative orders, refunds & stock adjustments
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search action, staff member, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A]"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 font-semibold focus:outline-hidden"
        >
          <option value="all">All Event Modules</option>
          <option value="order">Order Lifecycle</option>
          <option value="inventory">Inventory Movements</option>
          <option value="product">Catalogue Changes</option>
          <option value="rider">Fleet Dispatch</option>
          <option value="settings">Store Settings</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Module / Entity ID</th>
                <th className="py-3 px-4">Event Audit Details</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {l.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{l.staffName}</span>
                    <span className="text-[10px] text-slate-400">{l.staffEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{l.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-700 font-bold">
                      {l.entityId}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{l.details}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{l.result}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
