import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getDiaryById, updateDiary, deleteDiary, addComment, toggleReaction } from '../../services/diaryService';
import { ArrowLeft, Save, Lock, Users, Trash2, Heart, Send, MessageCircle } from 'lucide-react';
import DiaryEditor from '../../components/diary/DiaryEditor';
import { format } from 'date-fns';

export default function DiaryView() {
  const { currentUser, backendUser } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  
  const [diary, setDiary] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  
  useEffect(() => {
    if (currentUser && id) {
      loadDiary();
    }
  }, [currentUser, id]);

  const loadDiary = async () => {
    try {
      const token = await currentUser.getIdToken();
      const data = await getDiaryById(token, id);
      setDiary(data.diary);
      setComments(data.comments || []);
      setTitle(data.diary.title);
      setContent(data.diary.content);
      setVisibility(data.diary.visibility);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        router.push('/diary');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = await currentUser.getIdToken();
      const updated = await updateDiary(token, id, {
        title, content, visibility
      });
      setDiary(updated.diary);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update diary');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      const token = await currentUser.getIdToken();
      await deleteDiary(token, id);
      router.push('/diary');
    } catch (err) {
      alert('Failed to delete diary');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await addComment(token, id, newComment);
      setComments([...comments, res.comment]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  const handleReaction = async (reactionStr) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await toggleReaction(token, id, reactionStr);
      setDiary({ ...diary, reactions: res.reactions });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-pink">Loading memory...</div>;
  if (!diary) return null;

  const isOwner = diary.user_id === currentUser?.uid;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Head>
        <title>{diary.title} | CoupleLife OS</title>
      </Head>

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 text-dark-text"><ArrowLeft size={24} /></button>
        
        {isOwner && (
          <div className="flex gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 bg-gray-100 text-dark-text rounded-full text-sm font-semibold hover:bg-gray-200"
              >
                Edit
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-pink text-white rounded-full text-sm font-semibold shadow-md hover:bg-soft-pink"
              >
                <Save size={16} /> Save
              </button>
            )}
            <button onClick={handleDelete} className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {!isEditing ? (
          <>
            <div className="mb-6">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${diary.visibility === 'private' ? 'bg-gray-200 text-gray-600' : 'bg-primary-pink/20 text-primary-pink'}`}>
                    {diary.visibility === 'private' ? <Lock size={10} /> : <Users size={10} />}
                    {diary.visibility}
                  </span>
                  {diary.mood && diary.mood !== 'None' && (
                    <span className="text-xs font-semibold px-2 py-1 bg-soft-pink/20 text-primary-pink rounded-lg">
                      Mood: {diary.mood}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto font-medium">{format(new Date(diary.created_at), 'PPP • p')}</span>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  By <span className="text-dark-text font-bold">{diary.user_id === backendUser?.firebase_uid ? 'You' : backendUser?.partner_id?.name || 'Partner'}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-dark-text">{diary.title}</h1>
            </div>

            {/* Read-Only Content */}
            <div 
              className="prose prose-pink max-w-none bg-white p-6 rounded-2xl shadow-sm border border-border-pink mb-6"
              dangerouslySetInnerHTML={{ __html: diary.content }}
            />
            
            {/* Gallery Preview */}
            {diary.images?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-4 snap-x">
                {diary.images.map((img, i) => (
                  <img key={i} src={img} alt="Memory" className="w-48 h-48 object-cover rounded-xl snap-center shrink-0 border border-gray-200 shadow-sm" />
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="flex justify-center mt-8 mb-4">
              <button 
                onClick={() => handleReaction('❤️')}
                className="bg-white px-6 py-3 rounded-full shadow-md border border-border-pink flex items-center gap-2 hover:scale-105 transition-transform text-2xl"
              >
                ❤️
                <span className="text-sm font-bold text-gray-600">
                  {diary.reactions ? Object.keys(diary.reactions).length : 0}
                </span>
              </button>
            </div>

            {/* Comments for Shared Diaries */}
            {diary.visibility === 'shared' && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-dark-text mb-4 flex items-center gap-2">
                  <MessageCircle size={20} className="text-primary-pink" /> Comments
                </h3>
                <div className="space-y-4 mb-4">
                  {comments.map(c => (
                    <div key={c._id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span className="font-semibold text-primary-pink">{c.user_id === currentUser.uid ? 'You' : 'Partner'}</span>
                        <span>{format(new Date(c.created_at), 'p')}</span>
                      </div>
                      <p className="text-sm text-dark-text">{c.comment}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-sm text-gray-400 text-center">No comments yet.</p>}
                </div>

                <form onSubmit={handleComment} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a sweet comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-white border border-border-pink rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-pink outline-none"
                  />
                  <button type="submit" className="bg-primary-pink text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 hover:bg-soft-pink">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 outline-none text-dark-text mb-4"
            />
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setVisibility('private')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${visibility === 'private' ? 'bg-primary-pink/10 border-border-pink text-primary-pink' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
              >Private</button>
              <button 
                onClick={() => setVisibility('shared')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${visibility === 'shared' ? 'bg-primary-pink/10 border-border-pink text-primary-pink' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
              >Shared</button>
            </div>
            <DiaryEditor initialContent={content} onChange={setContent} />
          </>
        )}
      </div>
    </div>
  );
}
