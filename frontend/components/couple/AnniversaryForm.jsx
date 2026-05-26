import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { updateAnniversary } from '../../services/coupleService';

export default function AnniversaryForm({ onComplete }) {
  const [startedAt, setStartedAt] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAnniversary({
        relationship_started_at: startedAt,
        anniversary_date: anniversary
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-romantic p-6 border border-borderPink">
      <h3 className="text-xl font-bold text-dark mb-4 text-center">Important Dates 📅</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-light mb-1">When did you meet? (Optional)</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-primary" size={18} />
          <input
            type="date"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-light mb-1">Anniversary Date 💕</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-primary" size={18} />
          <input
            type="date"
            required
            value={anniversary}
            onChange={(e) => setAnniversary(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Dates'}
      </button>
    </form>
  );
}
