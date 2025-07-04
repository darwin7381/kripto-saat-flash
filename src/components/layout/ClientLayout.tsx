"use client";

import React from 'react';
import HeaderNew from '@/components/layout/Header-New';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <HeaderNew />
      {children}
      <Footer />
      <FloatingButtons />
    </div>
  );
} 