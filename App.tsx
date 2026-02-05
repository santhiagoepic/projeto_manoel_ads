
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { INITIAL_DATA } from './constants';
import { LandingPageData } from './types';

const STORAGE_KEY = 'legal_landing_data';

const applyThemeImageDefaults = (value: LandingPageData): LandingPageData => {
  return {
    ...value,
    theme: {
      ...value.theme,
      heroBgImage: INITIAL_DATA.theme.heroBgImage,
      puzzleImage: INITIAL_DATA.theme.puzzleImage,
      lawImage: INITIAL_DATA.theme.lawImage,
      pillsImage: INITIAL_DATA.theme.pillsImage,
      handshakeImage: INITIAL_DATA.theme.handshakeImage,
      lawyerImage: INITIAL_DATA.theme.lawyerImage,
    },
  };
};

const mergeSavedData = (saved: unknown): LandingPageData => {
  if (!saved || typeof saved !== 'object') return INITIAL_DATA;

  const savedData = saved as Partial<LandingPageData>;

  const merged: LandingPageData = {
    ...INITIAL_DATA,
    ...savedData,
    theme: { ...INITIAL_DATA.theme, ...savedData.theme },
    hero: { ...INITIAL_DATA.hero, ...savedData.hero },
    challenges: { ...INITIAL_DATA.challenges, ...savedData.challenges },
    legal: { ...INITIAL_DATA.legal, ...savedData.legal },
    denial: { ...INITIAL_DATA.denial, ...savedData.denial },
    about: { ...INITIAL_DATA.about, ...savedData.about },
    encouragement: { ...INITIAL_DATA.encouragement, ...savedData.encouragement },
    contact: { ...INITIAL_DATA.contact, ...savedData.contact },
    helpGrid: Array.isArray(savedData.helpGrid) ? savedData.helpGrid : INITIAL_DATA.helpGrid,
    process: Array.isArray(savedData.process) ? savedData.process : INITIAL_DATA.process,
    reviews: Array.isArray(savedData.reviews) ? savedData.reviews : INITIAL_DATA.reviews,
  };

  // As imagens devem ser trocadas no código (e não “ficarem presas” no localStorage).
  return applyThemeImageDefaults(merged);
};

const App: React.FC = () => {
  const [data, setData] = useState<LandingPageData>(INITIAL_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(mergeSavedData(JSON.parse(saved)));
      } catch {
        setData(INITIAL_DATA);
      }
    } else {
      setData(INITIAL_DATA);
    }

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Evita "tela branca" em caso de QuotaExceededError (imagens base64 podem estourar o limite)
    }

    // Sem API: persistimos somente no localStorage.
    if (!dataLoaded) return;
  }, [data, dataLoaded]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage data={data} />} />
          </Routes>
        </main>
        
        <Footer data={data} />
      </div>
    </Router>
  );
};

const Footer: React.FC<{ data: LandingPageData }> = ({ data }) => {
  const location = useLocation();
  // Se no futuro surgirem outras rotas, mantenha o footer apenas na landing.
  if (location.pathname !== '/') return null;

  return (
    <footer className="bg-[#00252D] text-white py-12 px-6 border-t border-[#003B46]">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-white/80">
          {data.about.title} © TODOS OS DIREITOS RESERVADOS
        </p>
        <p className="text-[10px] text-white/40 max-w-2xl mx-auto italic">
          Trabalhamos exclusivamente com serviços jurídicos especializados.
        </p>
      </div>
    </footer>
  );
};

export default App;
