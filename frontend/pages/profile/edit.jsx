import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import Avatar from '../../components/ui/Avatar';
import ImageCropModal from '../../components/profile/ImageCropModal';

export default function EditProfile() {
  const router = useRouter();
  const { backendUser, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: backendUser?.name || '',
    username: backendUser?.username || '',
    bio: backendUser?.bio || '',
    gender: backendUser?.gender || '',
    pronouns: backendUser?.pronouns || '',
    timezone: backendUser?.timezone || 'UTC',
    relationship_status: backendUser?.relationship_status || 'In Love 💕',
    relationship_story: backendUser?.relationship_story || '',
    anniversary_date: backendUser?.anniversary_date ? new Date(backendUser.anniversary_date).toISOString().split('T')[0] : '',
    avatar: backendUser?.avatar || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  if (!backendUser) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) return alert('Image must be under 5MB.');
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return alert('Only JPG, PNG, and WEBP are allowed.');
      
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropModal(false);
    
    // Read the blob as a base64 data URL for preview and DB storage
    const reader = new FileReader();
    reader.readAsDataURL(croppedBlob); 
    reader.onloadend = () => {
      const base64data = reader.result;
      setFormData(prev => ({ ...prev, avatar: base64data }));
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { auth } = await import('../../services/firebase');
      const token = await auth.currentUser.getIdToken();
      await updateProfile(token, formData);
      await refreshUser();
      router.push('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <ProfileHeader title="Edit Profile" />

      {showCropModal && (
        <ImageCropModal 
          imageSrc={imageToCrop}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer">
          <Avatar initials={backendUser.name?.charAt(0)} src={formData.avatar} size="xl" />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity">
            Change
          </div>
          <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageSelect} />
        </label>
        <p className="text-xs text-gray-500 mt-2">Max 5MB (JPG, PNG, WEBP)</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Basic Details</h3>
          <div className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email (Uneditable)</label>
              <input type="email" value={backendUser.email} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input label="Gender (Optional)" name="gender" value={formData.gender} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <Input label="Pronouns (Optional)" name="pronouns" value={formData.pronouns} onChange={handleChange} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Relationship Details</h3>
          <div className="space-y-4">
            <Input label="Relationship Status" name="relationship_status" value={formData.relationship_status} onChange={handleChange} />
            <Input type="date" label="Anniversary Date" name="anniversary_date" value={formData.anniversary_date} onChange={handleChange} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Relationship Story</label>
              <textarea name="relationship_story" value={formData.relationship_story} onChange={handleChange} rows="3" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50" />
            </div>
          </div>
        </section>

        <div className="pt-4 pb-6">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-md shadow-primary/30 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50" />
    </div>
  );
}
