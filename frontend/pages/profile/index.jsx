import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Settings, Shield, Bell, Key, LogOut } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import CompletionProgress from '../../components/profile/CompletionProgress';
import CompatibilityCard from '../../components/profile/CompatibilityCard';
import ProfileHeader from '../../components/profile/ProfileHeader';
import { generateCoupleKey } from '../../services/authService';

export default function ProfileDashboard() {
  const router = useRouter();
  const { backendUser, logout, refreshUser } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  if (!backendUser) return <div className="min-h-screen bg-background p-6">Loading...</div>;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <ProfileHeader title="Profile" backTo="/dashboard" />
      
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar 
            initials={backendUser.name?.charAt(0)?.toUpperCase()} 
            src={backendUser.avatar}
            size="xl" 
            className="mb-4"
          />
          <button 
            onClick={() => router.push('/profile/edit')}
            className="absolute bottom-4 right-0 bg-primary-pink text-white p-2 rounded-full shadow-md"
          >
            <Edit2 size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-dark">{backendUser.name}</h2>
        <p className="text-gray-500">@{backendUser.username || 'username'}</p>
        <div className="bg-pink-50 text-primary-pink px-4 py-1 rounded-full font-semibold text-sm mt-3">
          {backendUser.relationship_status || 'In Love 💕'}
        </div>
      </div>

      <div className="space-y-6">
        <CompletionProgress percentage={backendUser.profile_completion || 0} />
        
        {backendUser.partner_id ? (
          <CompatibilityCard />
        ) : (
          <Card title="Invite Partner" icon={Key}>
            <div className="py-4 text-center">
              {backendUser.couple_id ? (
                <>
                  <p className="text-sm text-gray-500 mb-3">Your Couple Key:</p>
                  <div className="font-mono font-bold text-primary-pink bg-primary-pink/5 py-2 rounded-lg tracking-widest mb-3">
                    {backendUser.couple_id.couple_key}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(backendUser.couple_id.couple_key);
                      alert('Copied!');
                    }}
                    className="text-sm font-semibold text-primary-pink underline"
                  >
                    Copy Key
                  </button>
                </>
              ) : (
                <button 
                  onClick={async () => {
                    try {
                      const { auth } = await import('../../services/firebase');
                      const token = await auth.currentUser.getIdToken();
                      await generateCoupleKey(token);
                      refreshUser();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="bg-primary-pink text-white font-semibold py-2 px-6 rounded-full text-sm"
                >
                  Generate Couple Key
                </button>
              )}
            </div>
          </Card>
        )}

        <Card title="Account Settings" icon={Settings}>
          <div className="space-y-2 py-2">
            <MenuButton icon={Edit2} label="Edit Profile" onClick={() => router.push('/profile/edit')} />
            <MenuButton icon={Bell} label="Preferences" onClick={() => router.push('/profile/settings')} />
            <MenuButton icon={Shield} label="Privacy & Visibility" onClick={() => router.push('/profile/privacy')} />
            <MenuButton icon={Key} label="Security" onClick={() => router.push('/profile/security')} />
          </div>
        </Card>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white text-red-500 rounded-xl p-4 font-semibold shadow-sm border border-red-50 flex items-center justify-center space-x-2"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-red-500 mb-2">Log Out?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out of CoupleLife?
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl"
              >
                Yes, Log Out
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-100 text-dark font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 text-dark font-medium">
        <div className="p-2 bg-pink-50 text-primary-pink rounded-lg">
          <Icon size={18} />
        </div>
        <span>{label}</span>
      </div>
      <div className="text-gray-300">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
