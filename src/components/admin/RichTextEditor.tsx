'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'align', 'link', 'image', 'blockquote', 'code-block',
];

export default function RichTextEditor({ value, onChange, placeholder, dir }: RichTextEditorProps) {
  return (
    <div className={`rich-editor ${dir === 'rtl' ? 'rtl-editor' : ''}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-editor .ql-container {
          min-height: 200px;
          border-radius: 0 0 12px 12px;
          border-color: #e5e7eb;
          font-size: 14px;
        }
        .rich-editor .ql-toolbar {
          border-radius: 12px 12px 0 0;
          border-color: #e5e7eb;
          background: #f9fafb;
        }
        .rich-editor .ql-editor {
          min-height: 200px;
        }
        .rtl-editor .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .rich-editor .ql-container:focus-within {
          border-color: #c9a84c;
          box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.2);
        }
      `}</style>
    </div>
  );
}
