import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { deleteAccount, logSecurityAction } from '../../services/securityService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ActivityTimeline from '../../components/profile/ActivityTimeline';

export default function Security() {
  const router = useRouter();
  const { backendUser, logout } = useAuth();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  if (!backendUser) return null;

  const handlePasswordResetEmail = async () => {
    try {
      const { auth } = await import('../../services/firebase');
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, backendUser.email);
      const token = await auth.currentUser.getIdToken();
      await logSecurityAction(token, 'PASSWORD_RESET_REQUESTED', 'Sent reset email');
      alert('Password reset email sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send reset email.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters.");
    }
    
    setIsChangingPassword(true);
    try {
      const { auth } = await import('../../services/firebase');
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
      
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      const token = await auth.currentUser.getIdToken();
      await logSecurityAction(token, 'PASSWORD_CHANGED', 'User changed their password securely');
      
      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      alert('Failed to update password. Check your old password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setIsChangingEmail(true);
    try {
      const { auth } = await import('../../services/firebase');
      const { EmailAuthProvider, reauthenticateWithCredential, updateEmail } = await import('firebase/auth');
      
      const credential = EmailAuthProvider.credential(auth.currentUser.email, emailPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      
      // Force token refresh so backend gets the new email in req.user
      const token = await auth.currentUser.getIdToken(true);
      await logSecurityAction(token, 'EMAIL_CHANGE_REQUESTED', `Changed email to ${newEmail}`);
      
      alert('Email updated successfully!');
      setNewEmail('');
      setEmailPassword('');
      window.location.reload(); // Reload to fetch fresh user data
    } catch (err) {
      console.error(err);
      alert('Failed to update email. Ensure your password is correct.');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      return alert("Please enter your password to confirm.");
    }
    
    try {
      const { auth } = await import('../../services/firebase');
      const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
      
      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      const token = await auth.currentUser.getIdToken();
      await deleteAccount(token);
      await auth.currentUser.delete();
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete account. Check your password.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <ProfileHeader title="Security" />

      <div className="space-y-6">
        
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <h3 className="font-bold text-dark mb-4">Email Address</h3>
          <p className="text-sm text-gray-500 mb-4">Current: {backendUser.email}</p>
          
          <form onSubmit={handleChangeEmail} className="space-y-3">
            <input 
              type="email" 
              placeholder="New Email Address" 
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink/50"
            />
            <input 
              type="password" 
              placeholder="Current Password (to verify)" 
              required
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink/50"
            />
            <button 
              type="submit"
              disabled={isChangingEmail}
              className="w-full bg-primary-pink text-white font-medium py-3 rounded-xl disabled:opacity-50"
            >
              {isChangingEmail ? 'Processing...' : 'Change Email'}
            </button>
          </form>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-dark">Change Password</h3>
            <button 
              type="button"
              onClick={handlePasswordResetEmail}
              className="text-xs text-primary-pink font-semibold"
            >
              Reset via Email
            </button>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input 
              type="password" 
              placeholder="Old Password" 
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink/50"
            />
            <input 
              type="password" 
              placeholder="New Password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink/50"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink/50"
            />
            <button 
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-primary-pink text-white font-medium py-3 rounded-xl disabled:opacity-50"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        <section>
          <h3 className="font-bold text-dark mb-4">Activity History</h3>
          <ActivityTimeline />
        </section>

        <section className="pt-6">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
          >
            Delete Account
          </button>
        </section>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-red-500 mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone. Please enter your password to confirm.
            </p>
            <input 
              type="password"
              placeholder="Confirm Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 mb-6"
            />
            <div className="space-y-3">
              <button 
                onClick={handleDelete}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl"
              >
                Yes, Delete My Account
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
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
