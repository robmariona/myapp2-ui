import { useState, useEffect } from 'react';
import api from '../api'; // Using the global axios instance we created
import { FileSearch, CheckCircle, XCircle } from 'lucide-react';

const AdminClaims = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await api.get('/Claims/admin/all');
      setClaims(res.data);
    } catch (err) {
      console.error("Error fetching claims", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'denied': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileSearch className="text-praxent-blue" /> Incoming Claims
        </h2>
        <span className="text-sm text-gray-500">{claims.length} Total Requests</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Claim ID</th>
              <th className="px-6 py-4">Policy</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Date Filed</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-500">#{claim.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{claim.policyName}</div>
                  <div className="text-xs text-gray-400">{claim.insuranceType}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {claim.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(claim.dateFiled).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-green-600 hover:text-green-800 p-1"><CheckCircle size={18} /></button>
                  <button className="text-red-600 hover:text-red-800 p-1"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClaims;