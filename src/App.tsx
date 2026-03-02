/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { AIAssistant } from '@/pages/AIAssistant';
import { Spirituality } from '@/pages/Spirituality';
import { Activities } from '@/pages/Activities';
import { Agenda } from '@/pages/Agenda';
import { Sitemap } from '@/components/Sitemap';

/**
 * Detecção de Ambiente de Preview
 * Retorna true se o hostname ou href conter indicadores de proxy
 */
const checkPreviewEnvironment = () => {
  const indicators = [
    'googleusercontent',
    'webcontainer',
    'shim',
    '.goog',
    'scf.usercontent',
    'stackblitz',
    'codesandbox'
  ];
  return indicators.some(indicator => 
    window.location.hostname.includes(indicator) || 
    window.location.href.includes(indicator)
  );
};

export default function App() {
  const isPreview = checkPreviewEnvironment();
  const Router = isPreview ? HashRouter : BrowserRouter;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirecionamento Inteligente na Raiz */}
          <Route index element={
            isPreview ? <Navigate to="/sitemap" replace /> : <Home />
          } />
          
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="spirituality" element={<Spirituality />} />
          <Route path="activities" element={<Activities />} />
          <Route path="agenda" element={<Agenda />} />
          
          {/* Fallback para Home se não estiver em preview e acessar / diretamente (já tratado pelo index) */}
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
