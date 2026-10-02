import React from 'react';
import { HeroSection, HeroSectionProps } from './HeroSection.tsx';

export type FuturisticRobotHeroProps = HeroSectionProps;

export const FuturisticRobotHero: React.FC<FuturisticRobotHeroProps> = (props) => {
  return <HeroSection {...props} />;
};

export default FuturisticRobotHero;
