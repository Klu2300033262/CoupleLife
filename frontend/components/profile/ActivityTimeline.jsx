import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getAuditLogs } from '../../services/securityService';
import { auth } from '../../services/firebase';
import { Clock } from 'lucide-react';

export default function ActivityTimeline() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const res = await getAuditLogs(token);
        setLogs(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      {logs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>}
      {logs.map((log) => (
        <div key={log._id} className="flex space-x-3 items-start">
          <div className="w-8 h-8 rounded-full bg-pink-50 `text-primary-pink flex items-center justify-center shrink-0 mt-1">
            <Clock size={14} />
          </div>
          <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-dark">{log.action.replace(/_/g, ' ')}</p>
            <p className="text-xs text-gray-400 mt-1">{format(new Date(log.timestamp), 'MMM d, h:mm a')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

