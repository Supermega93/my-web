'use client';

import React from 'react';
import { PromptArchitectPage } from '../../src/components/academy/PromptArchitectPage.tsx';

export default function PromptArchitectAppPage() {
  const handleNavigate = (view: string, extraId?: string) => {
    if (view === 'academy') {
      window.location.href = '/';
    } else if (view === 'lesson-detail' && extraId) {
      window.location.href = `/lessons/${extraId}`;
    } else if (view === 'custom-ea') {
      window.location.href = '/custom-ea';
    } else if (view === 'free-ebook') {
      window.location.href = '/free-ebook';
    } else if (view === 'eas') {
      window.location.href = '/trading-eas';
    } else {
      window.location.href = '/';
    }
  };

  return <PromptArchitectPage onNavigate={handleNavigate} />;
}
