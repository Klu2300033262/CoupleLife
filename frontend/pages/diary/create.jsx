import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { createDiary } from '../../services/diaryService';
import { ArrowLeft, Save, Lock, Users, Info } from 'lucide-react';
import DiaryEditor from '../../components/diary/DiaryEditor';
import VoiceRecorder from '../../components/diary/VoiceRecorder';
import MoodSelector from '../../components/diary/MoodSelector';
import ImageUploader from '../../components/diary/ImageUploader';

export default function CreateDiary() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [mood, setMood] = useState('None');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const DRAFT_KEY = 'new_diary';

  useEffect(() => {
    const draft = localStorage.getItem(`diary_draft_${DRAFT_KEY}`);
    if (draft && draft.length > 10) {
      setShowRecovery(true);
    }
  }, []);

  const handleRestore = () => {
    const draft = localStorage.getItem(`diary_draft_${DRAFT_KEY}`);
    if (draft) setContent(draft);
    setShowRecovery(false);
  };

  const handleDiscard = () => {
    localStorage.removeItem(`diary_draft_${DRAFT_KEY}`);
    setContent('');
    setShowRecovery(false);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      await createDiary(token, {
        title: title || 'Untitled Memory',
        content,
        visibility,
        mood,
        images,
        tags: [] // simple implementation
      });
      localStorage.removeItem(`diary_draft_${DRAFT_KEY}`);
      router.push('/diary');
    } catch (error) {
      console.error(error);
      alert('Failed to save diary');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text) => {
    setContent(prev => prev + ' ' + text);
    // TipTap doesn't auto-update from external state change unless we pass it specifically,
    // so in a full implementation, we'd use the Editor instance directly.
    // For now, setting content works if the Editor reacts to `initialContent` or we append it.
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <Head>
        <title>Write a Memory | CoupleLife OS</title>
      </Head>

      {/* Recovery Modal */}
      {showRecovery && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm text-center border border-border-pink">
            <div className="w-16 h-16 bg-soft-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="text-primary-pink" size={32} />
            </div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Unsaved Memory Found</h2>
            <p className="text-sm text-gray-text mb-6">Restore your unsaved memory? 💕</p>
            <div className="flex gap-3">
              <button onClick={handleDiscard} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold">Discard</button>
              <button onClick={handleRestore} className="flex-1 py-3 bg-primary-pink text-white rounded-xl font-semibold shadow-md">Restore</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 text-dark-text"><ArrowLeft size={24} /></button>
        <div className="flex gap-2">
          <button 
            onClick={() => setVisibility(visibility === 'private' ? 'shared' : 'private')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${visibility === 'private' ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-primary-pink/10 border-border-pink text-primary-pink'}`}
          >
            {visibility === 'private' ? <Lock size={12} /> : <Users size={12} />}
            {visibility === 'private' ? 'Private' : 'Shared'}
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-pink text-white rounded-full text-sm font-semibold shadow-md hover:bg-soft-pink transition-colors disabled:opacity-50"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <input 
          type="text" 
          placeholder="Give this memory a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 outline-none placeholder:text-gray-300 text-dark-text px-2"
        />

        <MoodSelector selected={mood} onSelect={setMood} />

        <DiaryEditor 
          initialContent={content} 
          onChange={(html) => setContent(html)} 
          draftKey={DRAFT_KEY}
        />

        <VoiceRecorder onTranscript={handleVoiceTranscript} />

        <ImageUploader images={images} onChange={setImages} />
        
        <div className="text-center text-xs text-gray-400 pb-10">
          Auto-saving locally every 5 seconds...
        </div>
      </div>
    </div>
  );
}
