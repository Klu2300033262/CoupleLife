import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2, Highlighter } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const toggleColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2 mb-4 bg-white border border-border-pink rounded-xl shadow-sm sticky top-0 z-10">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        <UnderlineIcon size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-lg font-bold transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        H2
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary-pink/10 text-primary-pink' : 'text-gray-text hover:bg-gray-100'}`}>
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <div className="flex gap-1 ml-auto">
        <button onClick={() => toggleColor('#ff4f9a')} className="w-6 h-6 rounded-full bg-[#ff4f9a] border border-gray-200" title="Primary Pink"></button>
        <button onClick={() => toggleColor('#1f2937')} className="w-6 h-6 rounded-full bg-[#1f2937] border border-gray-200" title="Dark Text"></button>
      </div>
    </div>
  );
};

export default function DiaryEditor({ initialContent, onChange, draftKey }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Write your thoughts here, baby... 💕',
      }),
      CharacterCount
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (draftKey) {
        localStorage.setItem(`diary_draft_${draftKey}`, html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-pink max-w-none focus:outline-none min-h-[300px] p-4 text-dark-text bg-card-white rounded-xl shadow-sm border border-border-pink',
      },
    },
  });

  // Expose append method for Voice Recorder
  useEffect(() => {
    if (editor && onChange) {
      onChange(editor.getHTML(), editor);
    }
  }, [editor]);

  return (
    <div className="w-full flex flex-col diary-editor-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-grow" />
      <div className="text-right text-xs text-gray-text mt-2">
        {editor ? editor.storage.characterCount.characters() : 0} characters
      </div>
    </div>
  );
}
