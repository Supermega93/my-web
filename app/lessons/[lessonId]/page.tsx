'use client';

import React from 'react';
import { LessonViewerPage } from '../../../src/components/academy/LessonViewerPage.tsx';

interface PageProps {
  params?: {
    lessonId?: string;
  };
}

export default function LessonPage({ params }: PageProps) {
  const lessonId = params?.lessonId || 
    (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'lesson-1-1' : 'lesson-1-1');

  const handleNavigate = (view: string, extraId?: string) => {
    if (view === 'academy') {
      window.location.href = '/';
    } else if (view === 'lesson-detail' && extraId) {
      window.location.href = `/lessons/${extraId}`;
    } else if (view === 'prompt-architect') {
      window.location.href = '/prompt-architect';
    } else if (view === 'custom-ea') {
      window.location.href = '/custom-ea';
    } else {
      window.location.href = '/';
    }
  };

  return <LessonViewerPage lessonId={lessonId} onNavigate={handleNavigate} />;
}
