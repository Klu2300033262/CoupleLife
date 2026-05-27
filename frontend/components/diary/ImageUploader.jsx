import React, { useCallback, useState } from 'react';
import { Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ images, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  // Note: For a real app, this would use Cloudinary upload endpoint.
  // We'll mock it by converting to local blob URLs for the preview.
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Check max limit (10)
    if (images.length + files.length > 10) {
      alert('You can only upload a maximum of 10 images per diary.');
      return;
    }

    const newImageUrls = [];
    for (const file of files) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
        };
      });
      newImageUrls.push(base64);
    }
    
    onChange([...images, ...newImageUrls]);
  };

  const removeImage = (indexToRemove) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-text mb-2">Photos (Max 10)</label>
      
      {/* Upload Zone */}
      <div 
        className={`w-full relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging ? 'border-primary-pink bg-primary-pink/5' : 'border-border-pink hover:bg-gray-50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* File handle logic here */ }}
      >
        <input 
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center pointer-events-none text-gray-text">
          <UploadCloud className="w-10 h-10 mb-2 text-soft-pink" />
          <p className="font-medium text-sm text-dark-text">Tap or drag photos here</p>
          <p className="text-xs mt-1 text-gray-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
        </div>
      </div>

      {/* Gallery Preview */}
      {images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide snap-x mt-2">
          <AnimatePresence>
            {images.map((url, idx) => (
              <motion.div 
                key={url} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative snap-center shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-sm"
              >
                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 backdrop-blur-sm hover:bg-black/70 transition"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
