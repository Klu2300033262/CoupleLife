import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { syncUserWithBackend, getMe, updateProfile, updateMood } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthAction = React.useRef(false);

  useEffect(() => {
  if (!auth) {
    setLoading(false);
    return;
  }
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);
    if (user) {
      if (isAuthAction.current) {
        // If we are explicitly logging in or signing up, that function handles the backend fetch
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const { user: dbUser } = await getMe(token);
        setBackendUser(dbUser);
      } catch (error) {
        console.error('Error fetching backend user:', error);
        if (error.response?.status === 404 && !isAuthAction.current) {
          await auth.signOut();
        }
      }
    } else {
      setBackendUser(null);
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);

  const signup = async (email, password, name) => {
    isAuthAction.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      try {
        const { user: dbUser } = await syncUserWithBackend(token, {
          email,
          name,
          firebase_uid: userCredential.user.uid,
          auth_provider: 'email',
          action: 'signup'
        });
        setBackendUser(dbUser);
        return userCredential;
      } catch (err) {
        if (auth.currentUser) {
          await userCredential.user.delete().catch(console.error);
          await auth.signOut();
        }
        throw new Error(err.response?.data?.error || err.message || 'Signup failed');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const token = await userCredential.user.getIdToken();
          const { user: dbUser } = await syncUserWithBackend(token, {
            email,
            name,
            firebase_uid: userCredential.user.uid,
            auth_provider: 'email',
            action: 'signup'
          });
          setBackendUser(dbUser);
          return userCredential;
        } catch (syncErr) {
          await auth.signOut();
          const errMsg = syncErr.response?.data?.error || syncErr.message || 'Signup failed';
          throw new Error(errMsg);
        }
      }
      throw new Error(err.message || 'Signup failed');
    } finally {
      isAuthAction.current = false;
    }
  };

  const login = async (email, password) => {
    isAuthAction.current = true;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const { user: dbUser } = await getMe(token);
      setBackendUser(dbUser);
      return userCredential;
    } catch (err) {
      await auth.signOut();
      throw new Error(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      isAuthAction.current = false;
    }
  };

  const loginWithGoogle = async (action = 'login') => {
    isAuthAction.current = true;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      const { user: dbUser } = await syncUserWithBackend(token, {
        email: userCredential.user.email,
        name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
        firebase_uid: userCredential.user.uid,
        auth_provider: 'google',
        action
      });
      setBackendUser(dbUser);
      return userCredential;
    } catch (err) {
      await auth.signOut();
      throw new Error(err.response?.data?.error || err.message || 'Google authentication failed');
    } finally {
      isAuthAction.current = false;
    }
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logout = () => {
    return signOut(auth);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(true);
        const { user: dbUser } = await getMe(token);
        setBackendUser(dbUser);
        return dbUser;
      } catch (error) {
        console.error('Error refreshing backend user:', error);
        if (error.response?.status === 404) {
          await auth.signOut();
        }
        throw error;
      }
    }
  };

  const updateUserProfile = async (data) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      const { user: dbUser } = await updateProfile(token, data);
      setBackendUser(dbUser);
      return dbUser;
    }
    throw new Error('Not authenticated');
  };

  const updateUserMood = async (data) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      const { user: dbUser } = await updateMood(token, data);
      setBackendUser(dbUser);
      return dbUser;
    }
    throw new Error('Not authenticated');
  };

  const value = {
    currentUser,
    backendUser,
    setBackendUser,
    signup,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
    refreshUser,
    updateUserProfile,
    updateUserMood
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
