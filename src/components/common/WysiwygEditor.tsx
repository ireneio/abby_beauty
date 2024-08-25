import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
import { api } from '@/lib/api/connector';
import { defaultInstance } from '@/lib/hooks/useApi';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Define toolbar options
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

// Define your custom image handler function
function imageHandler() {
  // @ts-ignore
  const quill = this.quill

  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file)
    const res = await api(defaultInstance, {
        method: 'POST',
        url: `/admin/files`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
    })
    return res
  }

  input.onchange = async function () {
    const file = input.files![0];
    const formData = new FormData();
    formData.append('image', file);

    // Example: upload image to your server or cloud
    const uploadRes = await uploadFile(file)
    if (uploadRes.code === 0 && uploadRes.data!.url) {
      const imageUrl = uploadRes.data!.url; // Assume response contains the URL
      // Insert image into Quill
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', imageUrl);
    }
  };
}

type Props = {
  value: string
  onChange: (value: string) => any
}

const WysiwygEditor = ({ onChange, value }: Props) => {
  return (
    <ReactQuill
      modules={{
        toolbar: {
          container: toolbarOptions,
          handlers: {
            'image': imageHandler
          }
        }
      }}
      theme="snow"
      value={value}
      onChange={onChange}
      
    />
  );
}

export default WysiwygEditor;
