/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Sanctuary } from './pages/Sanctuary';
import { Journal } from './pages/Journal';
import { Reflection } from './pages/Reflection';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/sanctuary" element={<Sanctuary />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<div className="p-8"><h1 className="font-serif text-3xl text-primary">History</h1><p className="text-on-surface-variant mt-4">Your past entries will appear here.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}
