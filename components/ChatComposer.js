'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export default function ChatComposer() {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function submit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    setValue('');
  }

  return (
    <div className="composer-wrap">
      <form className="composer" onSubmit={submit}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask anything..."
          rows={1}
          aria-label="Message Quero"
        />
        <button className="send" type="submit" aria-label="Send message" disabled={!value.trim()}>
          <Icon name="up" size={20} />
        </button>
      </form>
    </div>
  );
}
