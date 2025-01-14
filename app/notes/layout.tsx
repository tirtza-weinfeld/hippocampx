import type { Metadata } from 'next';
import React from 'react';



export const metadata: Metadata = {
  title: 'Notes',
};



export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className='@container/notes p-4 m-auto  grid max-w-[80ch]'>
          {children}
      </div>
  );
}



