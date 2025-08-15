import React from 'react';

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 .895 4.474a2.25 2.25 0 0 0 2.224 1.776h13.262a2.25 2.25 0 0 0 2.224-1.776L21.75 12M2.25 12a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 12M2.25 12v-2.25A2.25 2.25 0 0 1 4.5 7.5h15A2.25 2.25 0 0 1 21.75 9.75V12M12 18.75a.75.75 0 0 0 .75-.75V12.75a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 .75.75Z" />
  </svg>
);