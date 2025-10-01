import React from 'react';
import { MainHeader } from './MainHeader';
import { MainFooter } from './MainFooter';
type MainLayoutProps = {
  children: React.ReactNode;
};
export function MainLayout({
  children
}: MainLayoutProps) {
  return <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-grow">{children}</main>
      <MainFooter />
    </div>;
}