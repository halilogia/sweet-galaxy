/**
 * @unit candyIcons.tsx -> Module
 * @purpose [AUTO] Module logic for candyIcons.tsx.
 * @dependencies [react, @]
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
import React from 'react';
import type { CandyColor } from '@/domain/types';

export const CANDY_SVG: Record<CandyColor, React.ReactNode> = {
  red: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
      <path d="M50 20 Q70 20 70 50 Q70 80 50 80 Q30 80 30 50 Q30 20 50 20" fill="white" fillOpacity="0.2" />
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <rect x="20" y="20" width="60" height="60" rx="15" fill="currentColor" />
      <rect x="30" y="30" width="40" height="40" rx="10" fill="white" fillOpacity="0.2" />
    </svg>
  ),
  green: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" />
      <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="white" fillOpacity="0.2" />
    </svg>
  ),
  yellow: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <polygon points="50,10 61,40 95,40 67,60 78,90 50,70 22,90 33,60 5,40 39,40" fill="currentColor" />
    </svg>
  ),
  purple: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
      <circle cx="50" cy="50" r="20" fill="white" fillOpacity="0.3" />
    </svg>
  ),
  orange: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <rect x="15" y="30" width="70" height="40" rx="20" fill="currentColor" />
      <circle cx="35" cy="50" r="10" fill="white" fillOpacity="0.3" />
      <circle cx="65" cy="50" r="10" fill="white" fillOpacity="0.3" />
    </svg>
  ),
};
