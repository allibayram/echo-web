import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { PackageSearch, BadgeCheck, ShieldCheck, ArrowRightLeft, TrendingUp, Sparkles, UserCircle, LogOut, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import SellWorkflow from './pages/SellWorkflow';
import BuyWorkflow from './pages/BuyWorkflow';
import AgentDashboard from './pages/AgentDashboard';
import PromoVideo from './pages/PromoVideo';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyProfile from './pages/CompanyProfile';
import LotDetail from './pages/LotDetail';
import { useAuth } from './context/AuthContext';

// Market Ticker Component
const Ticker = () => {
  const tickerData = [
    { icon: TrendingUp, color: 'text-primary', name: 'PP_TR $1240', change: '+1.2%' },
    { icon: ArrowRightLeft, color: 'text-textMuted', name: 'HDPE_EU $1080', change: '-0.4%' },
    { icon: TrendingUp, color: 'text-primary', name: 'rPET_FLK $950', change: '+2.1%' },
    { icon: ArrowRightLeft, color: 'text-textMuted', name: 'LDPE_AS $1110', change: '0.0%' },
    { icon: TrendingUp, color: 'text-primary', name: 'PVC_K67 $895', change: '+0.8%' },
    { icon: ArrowRightLeft, color: 'text-red-400', name: 'ABS_SEA $1480', change: '-1.5%' },
    { icon: TrendingUp, color: 'text-primary', name: 'rPP_GRN $810', change: '+3.2%' },
    { icon: ArrowRightLeft, color: 'text-textMuted', name: 'LLDPE_ME $1130', change: '+0.3%' },
  ];
  return (
    <div className="bg-primary/10 border-b border-primary/20 overflow-hidden relative h-10 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
      <div className="whitespace-nowrap flex animate-[ticker_90s_linear_infinite]">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="flex gap-12 px-6 text-sm font-medium">
            {tickerData.map((item, j) => (
              <span key={j} className="flex items-center gap-2 text-textMain">
                <item.icon size={14} className={item.color} /> {item.name} <span className={item.color}>{item.change}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Animated Route Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/sat" element={
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }}>
            <SellWorkflow />
          </motion.div>
        } />
        <Route path="/al" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <BuyWorkflow />
          </motion.div>
        } />
        <Route path="/agent" element={
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}>
            <AgentDashboard />
          </motion.div>
        } />
        <Route path="/promo" element={<PromoVideo />} />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/company/:id" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <CompanyProfile />
          </motion.div>
        } />
        <Route path="/lot/:id" element={
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }}>
            <LotDetail />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Corporate Footer Component
const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6 bg-surface/30 backdrop-blur-md relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-sm text-textMuted">
        <div className="md:w-1/3">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-textMain flex items-center gap-2 mb-4">
            EcoGrade <span className="text-primary flex items-center"><Sparkles size={20} className="mr-1" />Broker</span>
          </Link>
          <p className="leading-relaxed mb-4">Dünyanın ilk %100 Laboratuvar kontrollü ve rezerv garantili Sanayi Borsası. İşletmelerin off-grade hammaddelerini likiditeye dönüştürüyor ve tedarikçilerle doğrudan bağlıyoruz.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" /> %100 Escrow Güvencesi Altında
          </div>
        </div>
        <div className="md:w-1/4">
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Kurumsal İletişim</h4>
          <ul className="space-y-3">
            <li><span className="text-white/50">Genel Merkez:</span> Barbaros Bulvarı No:14, Beşiktaş, İstanbul</li>
            <li><span className="text-white/50">Lojistik Merkezi:</span> GEBKİM Kimya İhtisas OSB, Kocaeli</li>
            <li><span className="text-white/50">Müşteri Hattı:</span> +90 (850) 555 12 34</li>
            <li><span className="text-white/50">E-Posta:</span> broker@ecograde.com</li>
          </ul>
        </div>
        <div className="md:w-1/4">
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Yasal Bilgiler</h4>
          <ul className="space-y-3">
            <li><button onClick={(e) => { e.preventDefault(); alert('MESAFELİ SATIŞ SÖZLEŞMESİ\n\nİşbu sözleşme EcoGrade B2B Industrial Exchange platformu üzerinden gerçekleştirilen tüm ticari işlemleri kapsamaktadır.\n\nTaraflar arasındaki alım-satım işlemleri Escrow güvencesi altında yürütülmektedir.\n\nYürürlük: 2026 | Sürüm: v1.2'); }} className="hover:text-primary transition-colors text-left w-full cursor-pointer">Mesafeli Satış Sözleşmesi</button></li>
            <li><button onClick={(e) => { e.preventDefault(); alert('KVKK AYDINLATMA METNİ\n\nEcoGrade B2B Industrial Exchange olarak kişisel verilerinizin güvenliği en önemli önceliğimizdir.\n\n6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verileriniz işlenmekte ve korunmaktadır.\n\nVeri Sorumlusu: EcoGrade A.Ş.\nİletişim: kvkk@ecograde.com'); }} className="hover:text-primary transition-colors text-left w-full cursor-pointer">Kullanıcı Aydınlatma Metni (KVKK)</button></li>
            <li><button onClick={(e) => { e.preventDefault(); alert('GİZLİLİK & GÜVENLİK POLİTİKASI\n\nPlatformumuzda 256-bit SSL şifreleme, iki faktörlü doğrulama ve Escrow güvenli ödeme sistemi kullanılmaktadır.\n\nTüm veriler AES-256 standardında şifrelenerek saklanır.\n\nSon güncelleme: Şubat 2026'); }} className="hover:text-primary transition-colors text-left w-full cursor-pointer">Gizlilik & Güvenlik Politikası</button></li>
            <li><span className="text-white/50">MERSİS No:</span> 0123456789000015</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 text-center text-xs opacity-60">
        &copy; {new Date().getFullYear()} EcoGrade B2B Industrial Exchange. All Rights Reserved. Not a public marketplace.
      </div>
    </footer>
  );
}

import { useTranslation } from 'react-i18next';
import { useCurrency } from './context/CurrencyContext';

function App() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'EUR' : 'USD');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden font-sans">

        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <Ticker />

        <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-textMain flex items-center gap-2">
            EcoGrade <span className="text-primary flex items-center"><Sparkles size={20} className="mr-1" />Broker</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center text-sm font-semibold">
            <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
              <div onClick={toggleLanguage} className="flex items-center gap-1 cursor-pointer hover:text-white text-textMuted transition-colors group relative">
                <Globe size={16} className="text-primary" />
                <span className="uppercase">{i18n.language}</span>
                <ChevronDown size={14} className="opacity-50" />
              </div>
              <div onClick={toggleCurrency} className="flex items-center gap-1 cursor-pointer hover:text-white text-textMuted transition-colors group relative">
                <span>{currency}</span>
                <ChevronDown size={14} className="opacity-50" />
              </div>
            </div>

            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><BadgeCheck size={18} color="#10B981" /> {t('app.lab')}</span>
            <span className="flex items-center gap-2 text-textMuted"><ShieldCheck size={18} className="text-accent" /> {t('app.escrow')}</span>

            {user ? (
              <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-4">
                <span className="flex items-center gap-2 text-white font-bold">
                  <UserCircle size={18} className="text-primary" /> {user.name}
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-1">{user.role}</span>
                </span>
                {user.role === 'AGENT' && (
                  <Link to="/agent" className="hidden lg:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl border border-primary/20">
                    <ShieldCheck size={16} /> Panel
                  </Link>
                )}
                <button onClick={() => { logout(); window.location.href = '/login'; }} className="flex items-center gap-2 text-textMuted hover:text-red-400 transition-colors ml-2">
                  <LogOut size={16} /> {t('app.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
                <Link to="/login" className="text-textMuted hover:text-white transition-colors">{t('app.login')}</Link>
                <Link to="/register" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors">
                  {t('app.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-20 z-40 glass-panel mx-4 mt-2 p-6 rounded-xl border border-white/10 flex flex-col gap-4 text-sm font-semibold overflow-y-auto max-h-[calc(100vh-6rem)]">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div onClick={() => { i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr'); }} className="flex items-center gap-1 cursor-pointer text-textMuted hover:text-white">
                <Globe size={16} className="text-primary" /> <span className="uppercase">{i18n.language}</span>
              </div>
              <div onClick={() => { setCurrency(currency === 'USD' ? 'EUR' : 'USD'); }} className="flex items-center gap-1 cursor-pointer text-textMuted hover:text-white">
                {currency}
              </div>
            </div>
            {user ? (
              <>
                <div className="flex items-center gap-2 text-white font-bold">
                  <UserCircle size={18} className="text-primary" /> {user.name}
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-1">{user.role}</span>
                </div>
                {user.role === 'AGENT' && (
                  <Link to="/agent" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-3 rounded-lg">
                    <ShieldCheck size={16} /> Agent Panel
                  </Link>
                )}
                <Link to="/sat" onClick={() => setMobileMenuOpen(false)} className="text-textMuted hover:text-white py-2">Sat</Link>
                <Link to="/al" onClick={() => setMobileMenuOpen(false)} className="text-textMuted hover:text-white py-2">Al</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); window.location.href = '/login'; }} className="flex items-center gap-2 text-red-400 mt-4 pt-4 border-t border-white/10">
                  <LogOut size={16} /> {t('app.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-textMuted hover:text-white py-2">{t('app.login')}</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-background px-4 py-3 rounded-lg text-center font-bold">{t('app.register')}</Link>
              </>
            )}
          </div>
        )}

        <main className="flex-1 relative z-10 w-full mb-12">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
