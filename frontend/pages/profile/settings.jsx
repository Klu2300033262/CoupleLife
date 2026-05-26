import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateSettings } from '../../services/profileService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ThemeSwitcher from '../../components/profile/ThemeSwitcher';

export default function Settings() {
  const { backendUser, refreshUser } = useAuth();
  const [preferences, setPreferences] = useState(backendUser?.notification_preferences || {});
  const [theme, setTheme] = useState(backendUser?.theme_preference || 'system');
  const [isSaving, setIsSaving] = useState(false);

  if (!backendUser) return null;

  const togglePref = (key) => setPreferences({ ...preferences, [key]: !preferences[key] });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { auth } = await import('../../services/firebase');
      const token = await auth.currentUser.getIdToken();
      await updateSettings(token, { notification_preferences: preferences, theme_preference: theme });
      await refreshUser();
      alert('Settings saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <ProfileHeader title="Preferences" />

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Notifications</h3>
          <div className="space-y-4">
            <Toggle label="Chat Notifications" checked={preferences.chat} onChange={() => togglePref('chat')} />
            <Toggle label="Mood Reminders" checked={preferences.mood} onChange={() => togglePref('mood')} />
            <Toggle label="Diary Reminders" checked={preferences.diary} onChange={() => togglePref('diary')} />
            <Toggle label="Anniversary Alerts" checked={preferences.anniversary} onChange={() => togglePref('anniversary')} />
            <Toggle label="Couple Activity" checked={preferences.couple_activity} onChange={() => togglePref('couple_activity')} />
            <Toggle label="Marketing" checked={preferences.marketing} onChange={() => togglePref('marketing')} />
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Couple Info</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="font-medium text-dark">Couple Key</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{backendUser.couple_id?.couple_key || 'Not Generated'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="font-medium text-dark">Partner</span>
              <span>{backendUser.partner_id ? backendUser.partner_id.name : 'Not Linked'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="font-medium text-dark">Status</span>
              <span>{backendUser.relationship_status || 'In Love 💕'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-dark">Anniversary</span>
              <span>{backendUser.anniversary_date ? new Date(backendUser.anniversary_date).toLocaleDateString() : 'Not Set'}</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Theme</h3>
          <ThemeSwitcher currentTheme={theme} onChange={setTheme} />
        </section>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-md shadow-primary/30"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-dark">{label}</span>
      <button 
        onClick={onChange}
        className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#10b981]' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>
  );
}
