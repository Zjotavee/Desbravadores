/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { AIAssistant } from '@/pages/AIAssistant';
import { Spirituality } from '@/pages/Spirituality';
import { Activities } from '@/pages/Activities';
import { Agenda } from '@/pages/Agenda';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="spirituality" element={<Spirituality />} />
          <Route path="activities" element={<Activities />} />
          <Route path="agenda" element={<Agenda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
