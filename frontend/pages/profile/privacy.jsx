import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateSettings } from '../../services/profileService';
import ProfileHeader from '../../components/profile/ProfileHeader';

export default function PrivacySettings() {
  const { backendUser, refreshUser } = useAuth();
  const [visibility, setVisibility] = useState(backendUser?.visibility_settings || {});
  const [isSaving, setIsSaving] = useState(false);

  if (!backendUser) return null;

  const handleChange = (key, value) => setVisibility({ ...visibility, [key]: value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { auth } = await import('../../services/firebase');
      const token = await auth.currentUser.getIdToken();
      await updateSettings(token, { visibility_settings: visibility });
      await refreshUser();
      alert('Privacy settings saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const options = ['Public', 'Partner only', 'Private'];

  return (
    <div className="min-h-screen bg-background p-6">
      <ProfileHeader title="Privacy & Visibility" />

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Relationship Visibility</h3>
          <p className="text-xs text-gray-500 mb-6">Control who can see your couple details.</p>
          
          <div className="space-y-5">
            <SelectOption label="Anniversary Date" value={visibility.anniversary} options={options} onChange={(val) => handleChange('anniversary', val)} />
            <SelectOption label="Relationship Status" value={visibility.status} options={options} onChange={(val) => handleChange('status', val)} />
            <SelectOption label="Shared Memories" value={visibility.memories} options={options} onChange={(val) => handleChange('memories', val)} />
            <SelectOption label="Couple Stats" value={visibility.stats} options={options} onChange={(val) => handleChange('stats', val)} />
          </div>
        </section>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary-pink text-white py-3.5 rounded-xl font-bold shadow-md shadow-primary-pink/30"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function SelectOption({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-dark mb-2">{label}</label>
      <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
        {options.map(opt => (
          <button 
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              value === opt ? 'bg-white text-primary-pink shadow-sm' : 'text-gray-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
