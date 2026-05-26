import React, { useState } from 'react';
import { Smile, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'loved', label: 'Loved', emoji: '🥰' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '🤔' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
];

export default function MoodTracker({ currentUser, partner }) {
  const { updateUserMood } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (selectedMood || note.trim()) {
      setIsSaving(true);
      try {
        await updateUserMood({ mood: selectedMood, note: note.trim() });
        setSelectedMood(null);
        setNote('');
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const renderSavedMood = (userObj, isCurrentUser) => {
    if (!userObj?.current_mood) return null;
    const { mood, note } = userObj.current_mood;
    if (!mood && !note) return null;
    
    const moodObj = mood ? MOODS.find(m => m.id === mood) : null;
    
    return (
      <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-100 mb-4">
        <div className="flex items-center space-x-4 mb-3">
          {moodObj ? (
            <>
              <div className="text-3xl">{moodObj.emoji}</div>
              <div>
                <h3 className="text-dark font-medium text-base">
                  {userObj.name} is feeling <span className="text-primary font-bold">{moodObj.label}</span>
                </h3>
                <p className="text-gray-500 text-xs">Updated recently</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-dark font-medium text-base">
                {userObj.name} left a note
              </h3>
              <p className="text-gray-500 text-xs">Updated recently</p>
            </div>
          )}
        </div>
        {note && (
          <div className="bg-white rounded-xl p-3 shadow-sm italic text-dark text-sm border border-gray-100">
            "{note}"
          </div>
        )}
        {isCurrentUser && (
          <button 
            onClick={async () => await updateUserMood({ mood: null, note: null })}
            className="w-full mt-3 bg-white text-primary border border-primary/20 rounded-xl py-2 font-semibold text-xs flex items-center justify-center hover:bg-pink-50 transition-colors"
          >
            <MessageCircle size={14} className="mr-1" />
            Clear Mood
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-romantic p-6 mb-8">
      {renderSavedMood(partner, false)}
      {renderSavedMood(currentUser, true)}

      <div className="flex items-center space-x-2 text-dark font-bold mb-6">
        <Smile className="text-primary" size={20} />
        <h2>How are you feeling?</h2>
      </div>

      <div className="grid grid-cols-3 gap-y-6 gap-x-2 mb-6">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-colors ${
              selectedMood === mood.id ? 'bg-pink-50 ring-2 ring-primary/20' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-3xl mb-2">{mood.emoji}</span>
            <span className="text-xs font-medium text-gray-500">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Leave a note for today..."
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none min-h-[100px] mb-4 shadow-sm"
        />
        <div className="flex space-x-3">
          <button 
            onClick={() => { setSelectedMood(null); setNote(''); }}
            className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-3 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!selectedMood && !note.trim()}
            className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold text-sm shadow-md shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Placeholder for Weekly Trend */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-gray-500 font-semibold text-sm mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Weekly Mood Trend</span>
        </div>
        
        <div className="flex justify-between items-end h-20 px-2">
          {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className="flex flex-col items-center">
              {i === 6 ? (
                <div className="w-1.5 h-12 bg-primary rounded-full mb-2"></div>
              ) : i === 3 || i === 4 ? (
                <div className="w-1.5 h-8 bg-pink-200 rounded-full mb-2"></div>
              ) : (
                <div className="w-1.5 h-4 bg-gray-200 rounded-full mb-2"></div>
              )}
              <span className={`text-[10px] font-medium ${i === 6 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
