import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, User, Mail, MapPin } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

export default function EditProfile() {
  const router = useRouter();
  const { backendUser, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (backendUser) {
      setFormData({
        name: backendUser.name || '',
        email: backendUser.email || '', // Usually email is not editable if it's primary, but showing it as disabled
        location: backendUser.location || ''
      });
    } else {
      const timer = setTimeout(() => router.push('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [backendUser, router]);

  if (!backendUser) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateUserProfile({
        name: formData.name,
        location: formData.location
      });
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-10 pb-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-full flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-dark">Edit Profile</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30 hover:scale-105 transition-transform disabled:opacity-50"
        >
          <Save size={18} />
        </button>
      </header>
      
      <main className="flex-1 px-6 py-4">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <div className="flex flex-col items-center mb-8">
          <Avatar 
            initials={formData.name.charAt(0).toUpperCase()} 
            size="lg" 
            showCamera={true}
            onClick={() => alert("Avatar upload not yet implemented!")}
          />
          <p className="text-xs text-gray-500 mt-2 font-medium">Tap to change photo</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl text-dark text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-sm font-medium shadow-sm opacity-70"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl text-dark text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                placeholder="Your location"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
