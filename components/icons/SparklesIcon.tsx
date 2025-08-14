
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.9 4.2-4.2 1.9 4.2 1.9 1.9 4.2 1.9-4.2 4.2-1.9-4.2-1.9Z" />
    <path d="M5 22s1.5-2 4-2c2.5 0 4 2 4 2" />
    <path d="M15 22s1.5-2 4-2c2.5 0 4 2 4 2" />
  </svg>
);
