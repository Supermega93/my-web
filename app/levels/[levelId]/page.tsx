'use client';

import React from 'react';
import { LevelHubPage } from '../../../src/components/academy/LevelHubPage.tsx';

interface PageProps {
  params?: {
    levelId?: string;
  };
}

export default function LevelOutlineHubPage({ params }: PageProps) {
  // Extract levelId from params or URL pathname fallback
  const levelId =
    params?.levelId ||
    (typeof window !== 'undefined'
      ? window.location.pathname.split('/').filter(Boolean).pop() || '1'
      : '1');

  const handleNavigate = (view: string, extraId?: string) => {
    if (view === 'academy') {
      window.location.href = '/';
    } else if (view === 'level-hub' && extraId) {
      window.location.href = `/levels/${extraId}`;
    } else if (view === 'lesson-detail' && extraId) {
      window.location.href = `/lessons/${extraId}`;
    } else if (view === 'prompt-architect') {
      window.location.href = '/prompt-architect';
    } else if (view === 'custom-ea') {
      window.location.href = '/custom-ea';
    } else if (view === 'login') {
      window.location.href = '/login';
    } else {
      window.location.href = '/';
    }
  };

  return <LevelHubPage levelId={levelId} onNavigate={handleNavigate} />;
}
