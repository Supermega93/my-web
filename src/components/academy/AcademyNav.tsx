import React from 'react';
import { ActiveView } from '../../types.ts';
import { GlobalNavbar } from '../common/GlobalNavbar.tsx';

export interface AcademyNavProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  activeTab?: 'curriculum' | 'prompt-architect' | 'ebook' | 'pricing';
  currentLevel?: number;
}

export const AcademyNav: React.FC<AcademyNavProps> = ({ onNavigate, activeTab }) => {
  const currentView: ActiveView = activeTab === 'pricing'
    ? 'academy-pricing'
    : activeTab === 'prompt-architect'
    ? 'prompt-architect'
    : 'academy';

  return (
    <div className="w-full">
      <GlobalNavbar
        currentView={currentView}
        activeView={currentView}
        onNavigate={onNavigate}
      />
      {/* Spacer to prevent fixed floating navbar from covering top academy content */}
      <div className="h-16 sm:h-20" />
    </div>
  );
};

export default AcademyNav;
