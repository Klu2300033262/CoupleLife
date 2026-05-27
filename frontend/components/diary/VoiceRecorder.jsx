import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        // Only stop if we actually clicked stop, otherwise it might have timed out, so restart
        if (isRecording) {
            recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript.trim() && onTranscript) {
        onTranscript(transcript);
      }
      setTranscript('');
    } else {
      setTranscript('');
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error(e);
      }
    }
  };

  if (!recognitionRef.current) {
    return <div className="text-xs text-gray-400">Voice typing not supported on this browser.</div>;
  }

  return (
    <div className="flex items-center gap-3 w-full bg-white p-3 rounded-xl shadow-sm border border-border-pink">
      <button 
        onClick={toggleRecording}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-pink text-white hover:bg-soft-pink'}`}
      >
        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      
      <div className="flex-1 min-h-[3rem] flex items-center">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div 
              key="recording"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-1">
                <Loader2 size={14} className="animate-spin text-primary-pink" />
                <span className="text-xs font-semibold text-primary-pink uppercase tracking-widest">Listening...</span>
              </div>
              <p className="text-sm text-dark-text italic truncate w-full pr-4">{transcript || 'Speak now...'}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-sm text-gray-text"
            >
              Tap to use voice typing 💕
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
