import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getDiaries } from '../../services/diaryService';
import { Plus, Search, BookHeart, Lock, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function DiaryDashboard() {
  const { currentUser, backendUser } = useAuth();
  const router = useRouter();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, shared, private
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadDiaries();
    }
  }, [currentUser]);

  const loadDiaries = async () => {
    try {
      const token = await currentUser.getIdToken();
      const data = await getDiaries(token);
      setDiaries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiaries = diaries.filter(d => {
    const matchesFilter = filter === 'all' ? true : d.visibility === filter;
    const matchesSearch = search === '' || d.title.toLowerCase().includes(search.toLowerCase()) || d.content.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Head>
        <title>Our Diary | CoupleLife OS</title>
      </Head>

      <div className="bg-white px-6 pt-10 pb-6 rounded-b-3xl shadow-sm relative z-10 border-b border-border-pink">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark-text flex items-center gap-2">
            Memories <BookHeart className="text-primary-pink" />
          </h1>
          <button 
            onClick={() => router.push('/diary/create')}
            className="bg-primary-pink text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-soft-pink transition-all"
          >
            <Plus />
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-pink text-dark-text outline-none text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${filter === 'all' ? 'bg-primary-pink text-white' : 'bg-gray-100 text-gray-500'}`}>All</button>
          <button onClick={() => setFilter('shared')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 ${filter === 'shared' ? 'bg-primary-pink text-white' : 'bg-gray-100 text-gray-500'}`}><Users size={12}/> Shared</button>
          <button onClick={() => setFilter('private')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 ${filter === 'private' ? 'bg-primary-pink text-white' : 'bg-gray-100 text-gray-500'}`}><Lock size={12}/> Private</button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center text-gray-400 mt-10 text-sm">Loading memories... 💕</div>
        ) : filteredDiaries.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="mb-4">No memories found.</p>
            <button onClick={() => router.push('/diary/create')} className="text-primary-pink font-semibold">Write your first diary</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDiaries.map((diary) => (
              <motion.div 
                key={diary._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/diary/${diary._id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border-pink/50 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Decorative blob */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-soft-pink/10 rounded-full blur-xl group-hover:bg-soft-pink/20 transition-colors"></div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-dark-text">{diary.title}</h3>
                  {diary.visibility === 'private' ? <Lock size={14} className="text-gray-400" /> : <Users size={14} className="text-primary-pink" />}
                </div>
                
                {/* Strip HTML tags for preview */}
                <p className="text-sm text-gray-text line-clamp-2 mb-3">
                  {diary.content.replace(/<[^>]+>/g, '') || 'Empty memory...'}
                </p>
                
                <div className="flex flex-col gap-2 mt-4 border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar size={13} className="text-primary-pink" />
                      {format(new Date(diary.created_at), 'MMM d, yyyy • h:mm a')}
                    </div>
                    {diary.mood && diary.mood !== 'None' && (
                      <span className="text-xs font-semibold px-2 py-1 bg-soft-pink/10 text-primary-pink rounded-lg border border-soft-pink/20">
                        {diary.mood}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <span className="text-gray-400">By</span> <span className="font-semibold text-dark-text">{diary.user_id === backendUser?.firebase_uid ? 'You' : backendUser?.partner_id?.name || 'Partner'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
