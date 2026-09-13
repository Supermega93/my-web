'use client';

import React from 'react';
import { AcademyHomePage } from '../src/components/academy/AcademyHomePage.tsx';

export default function Page() {
  const handleNavigate = (view: string, extraId?: string) => {
    if (view === 'prompt-architect') {
      window.location.href = '/prompt-architect';
    } else if (view === 'lesson-detail' && extraId) {
      window.location.href = `/lessons/${extraId}`;
    } else if (view === 'free-ebook') {
      window.location.href = '/free-ebook';
    } else if (view === 'eas') {
      window.location.href = '/trading-eas';
    } else if (view === 'login') {
      window.location.href = '/login';
    } else if (view === 'portal') {
      window.location.href = '/portal';
    } else {
      window.location.href = '/';
    }
  };

  return <AcademyHomePage onNavigate={handleNavigate} />;
}
