/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { Lab } from './pages/Lab';
import { Project } from './pages/Project';
import { Contact } from './pages/Contact';
import { Nav } from './components/Nav';
import { Menu } from './components/Menu';
import { Footer } from './components/Footer';
import { TransitionGrid } from './components/TransitionGrid';
import TargetCursor from './components/TargetCursor';
import { useLenis } from './hooks/useLenis';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const win = window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } };
    win.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

function AppContent() {
  useLenis();
  const location = useLocation();
  const showFooter = location.pathname !== '/';

  return (
    <>
      <ScrollToTop />
      <TargetCursor 
        spinDuration={2} 
        hideDefaultCursor 
        parallaxOn 
        blendMode="normal"
        showLabel={false}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
        targetSelector=".cursor-target, a, button, [role='button']"
      />
      <Nav />
      <Menu />
      <TransitionGrid />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/project" element={<Project />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
