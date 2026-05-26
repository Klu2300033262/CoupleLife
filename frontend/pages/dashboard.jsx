import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Calendar, CalendarClock, Bell, User } from 'lucide-react';
import Card from '../components/ui/Card';
import CoupleProfileCard from '../components/ui/CoupleProfileCard';
import QuickAccess from '../components/ui/QuickAccess';
import MoodTracker from '../components/ui/MoodTracker';
import { generateCoupleKey } from '../services/authService';
import { differenceInDays, differenceInMonths, addYears, differenceInHours, differenceInMinutes, format, isAfter } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const { backendUser, refreshUser } = useAuth();
  const [timeTogether, setTimeTogether] = useState({ days: 0, months: 0, remainderDays: 0 });
  const [nextAnniversary, setNextAnniversary] = useState({ days: 0, hours: 0, mins: 0, date: null });
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!backendUser) {
        router.push('/');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [backendUser, router]);

  useEffect(() => {
    if (!backendUser || backendUser.partner_id) return;
    const interval = setInterval(async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.error('Error polling user state:', err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [backendUser, refreshUser]);

  useEffect(() => {
    if (backendUser && backendUser.couple_id) {
      // Use couple_id.created_at or fallback to a hardcoded date for demo if undefined
      const startDate = new Date(backendUser.couple_id.created_at || backendUser.created_at);
      const now = new Date();
      
      const totalDays = differenceInDays(now, startDate);
      const months = differenceInMonths(now, startDate);
      
      // Rough remainder days calculation
      const dateAfterMonths = new Date(startDate);
      dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
      const remainderDays = differenceInDays(now, dateAfterMonths);
      
      setTimeTogether({ days: totalDays, months, remainderDays });

      // Calculate next anniversary (yearly)
      let nextAnniv = addYears(startDate, 1);
      let years = 1;
      while (!isAfter(nextAnniv, now)) {
        years++;
        nextAnniv = addYears(startDate, years);
      }
      
      const annivDays = differenceInDays(nextAnniv, now);
      const annivHours = differenceInHours(nextAnniv, now) % 24;
      const annivMins = differenceInMinutes(nextAnniv, now) % 60;
      
      setNextAnniversary({
        days: annivDays,
        hours: annivHours,
        mins: annivMins,
        date: nextAnniv,
        yearLabel: `${years} Year Anniversary`
      });
    }
  }, [backendUser]);

  if (!backendUser) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!backendUser.partner_id) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-dark mb-4">CoupleLife OS</h1>
        <div className="p-6 bg-white rounded-2xl shadow-sm text-center w-full max-w-sm mb-6 border border-pink-50">
          <h2 className="font-bold text-lg text-dark mb-2">Partner Not Linked</h2>
          {backendUser.couple_id ? (
            <>
              <p className="text-sm text-gray-500 mb-4">Share this Couple Key with your partner so they can join you!</p>
              <div className="bg-gray-50 rounded-xl p-4 font-mono font-bold text-lg tracking-widest text-primary border border-gray-100 mb-4">
                {backendUser.couple_id.couple_key}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(backendUser.couple_id.couple_key);
                  alert('Copied to clipboard!');
                }}
                className="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/20 transition-colors"
              >
                Copy Key
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">Generate a Couple Key to invite your partner.</p>
              <button 
                onClick={async () => {
                  try {
                    const { auth } = await import('../services/firebase');
                    const token = await auth.currentUser.getIdToken();
                    await generateCoupleKey(token);
                    refreshUser();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/50 transition-colors"
              >
                Generate Key
              </button>
            </>
          )}
        </div>
        <button onClick={() => router.push('/profile')} className="mt-2 text-primary font-semibold hover:underline">
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2 text-xl font-bold text-dark">
          <span className="text-primary text-2xl">💕</span>
          <span>CoupleLife</span>
        </div>
        <button 
          onClick={() => router.push('/profile')} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-primary transition-colors overflow-hidden border border-gray-100"
        >
          {backendUser.avatar ? <img src={backendUser.avatar} className="w-full h-full object-cover" alt="Profile" /> : <User size={20} />}
        </button>
      </header>
      
      <main className="flex-1 p-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dark mb-1">
            Hi, {backendUser.name?.toUpperCase() || 'THERE'} 💕
          </h1>
          <p className="text-sm text-gray-500">
            Together with {backendUser.partner_id.name}
          </p>
        </div>

        <CoupleProfileCard user={backendUser} partner={backendUser.partner_id} />

        <MoodTracker currentUser={backendUser} partner={backendUser.partner_id} />

        <Card title="Time Together" icon={Calendar}>
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-[#10b981] flex items-center justify-center mb-4 shadow-lg shadow-[#10b981]/20">
              <span className="text-3xl text-white">🎉</span>
            </div>
            
            <h2 className="text-5xl font-black text-dark mb-1">{timeTogether.days}</h2>
            <p className="text-gray-light font-medium mb-4">Days Together</p>
            
            <div className="bg-[#10b981] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 mb-8 shadow-sm">
              <span>🎉</span>
              <span>100 Days Milestone</span>
            </div>
            
            <div className="flex w-full justify-around text-center mb-6 px-4">
              <div>
                <p className="text-2xl font-bold text-dark">{timeTogether.months}</p>
                <p className="text-xs text-gray-500 font-medium">Months</p>
              </div>
              <div className="w-px bg-gray-100"></div>
              <div>
                <p className="text-2xl font-bold text-dark">{timeTogether.remainderDays}</p>
                <p className="text-xs text-gray-500 font-medium">Days</p>
              </div>
            </div>
            
            <div className="w-full bg-pink-50/50 text-pink-500 rounded-lg p-3 flex items-center text-sm font-medium">
              <Calendar size={16} className="mr-2" />
              Next: {Math.ceil(timeTogether.days / 100) * 100} days
            </div>
          </div>
        </Card>

        <Card title="Next Anniversary" icon={CalendarClock}>
          <div className="flex flex-col items-center py-4">
            <p className="text-sm text-gray-500 font-medium mb-6">{nextAnniversary.yearLabel}</p>
            
            <div className="flex w-full justify-around text-center mb-6">
              <div>
                <p className="text-3xl font-black text-dark">{nextAnniversary.days}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Days</p>
              </div>
              <div>
                <p className="text-3xl font-black text-dark">{nextAnniversary.hours}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Hours</p>
              </div>
              <div>
                <p className="text-3xl font-black text-dark">{nextAnniversary.mins}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Mins</p>
              </div>
            </div>
            
            <div className="w-full bg-pink-50/50 text-pink-500 rounded-lg p-3 flex items-center justify-center text-sm font-medium mb-4">
              <Calendar size={16} className="mr-2" />
              {nextAnniversary.date ? format(nextAnniversary.date, 'MMMM d, yyyy') : 'Loading...'}
            </div>
            
            <button 
              onClick={() => {
                setReminderEnabled(true);
                if ('Notification' in window) {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('CoupleLife Anniversary', {
                        body: `Reminder set for ${format(nextAnniversary.date, 'MMMM d, yyyy')}!`
                      });
                    }
                  });
                }
                const gCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Our Anniversary 💕')}&dates=${format(nextAnniversary.date, 'yyyyMMdd')}/${format(nextAnniversary.date, 'yyyyMMdd')}&details=${encodeURIComponent('Celebrating another beautiful year together!')}`;
                window.open(gCalLink, '_blank');
              }}
              className={`w-full rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center transition-colors ${
                reminderEnabled 
                  ? 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell size={16} className="mr-2" />
              {reminderEnabled ? 'Reminder Set in Calendar & Notifications!' : 'Enable Reminder'}
            </button>
          </div>
        </Card>

        <QuickAccess />
      </main>
    </div>
  );
}
