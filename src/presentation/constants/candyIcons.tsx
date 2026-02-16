/**
 * @unit candyIcons.tsx -> Module
 * @purpose [AUTO] Module logic for candyIcons.tsx.
 * @dependencies [react, @]
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
import React from 'react';
import type { CandyColor, CandyType } from '@/domain/types';

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

/** Galaxy temalı özel şeker ikonları (renk Tile'da currentColor ile verilir). */
export const SPECIAL_CANDY_SVG: Record<Exclude<CandyType, 'normal'>, React.ReactNode> = {
  'striped-h': (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <ellipse cx="50" cy="50" rx="42" ry="38" fill="currentColor" />
      <path d="M8 50 H92" stroke="rgba(255,255,255,0.5)" strokeWidth="8" strokeLinecap="round" />
      <path d="M8 35 H92 M8 65 H92" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="50" r="4" fill="white" fillOpacity="0.6" />
      <circle cx="80" cy="50" r="4" fill="white" fillOpacity="0.6" />
    </svg>
  ),
  'striped-v': (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <ellipse cx="50" cy="50" rx="38" ry="42" fill="currentColor" />
      <path d="M50 8 V92" stroke="rgba(255,255,255,0.5)" strokeWidth="8" strokeLinecap="round" />
      <path d="M35 8 V92 M65 8 V92" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="25" r="4" fill="white" fillOpacity="0.6" />
      <circle cx="50" cy="75" r="4" fill="white" fillOpacity="0.6" />
    </svg>
  ),
  wrapped: (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="50" cy="50" r="38" fill="currentColor" />
      <path d="M50 15 L58 42 L88 42 L62 58 L72 88 L50 72 L28 88 L38 58 L12 42 L42 42 Z" fill="rgba(255,255,255,0.4)" />
      <circle cx="50" cy="50" r="12" fill="rgba(255,255,255,0.5)" />
      <circle cx="30" cy="35" r="3" fill="white" fillOpacity="0.8" />
      <circle cx="70" cy="40" r="3" fill="white" fillOpacity="0.8" />
      <circle cx="50" cy="65" r="3" fill="white" fillOpacity="0.8" />
    </svg>
  ),
  'color-bomb': (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
      <circle cx="50" cy="50" r="28" fill="rgba(255,255,255,0.3)" />
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i * 60 * Math.PI) / 180;
        return <circle key={i} cx={50 + 22 * Math.cos(a)} cy={50 + 22 * Math.sin(a)} r="6" fill="white" fillOpacity="0.7" />;
      })}
      <circle cx="50" cy="50" r="8" fill="white" fillOpacity="0.9" />
    </svg>
  ),
};
