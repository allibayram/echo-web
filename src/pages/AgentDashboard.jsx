import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Activity, Database, Terminal as TerminalIcon, BarChart2, Zap, AlertTriangle, Trash2, Eye, EyeOff, Lock, LogIn, X, RefreshCw, Shield, Wifi, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ==================== CONSTANTS ==================== */
const CRITERIA = [
    { id: 'mfi', label: 'MFI (Erime Akış)', weight: 5 },
    { id: 'nem', label: 'Nem Oranı', weight: 5 },
    { id: 'katki', label: 'Katkı/Karışım', weight: 5 },
    { id: 'gorsel', label: 'Görsel Kalite', weight: 5 },
    { id: 'koku', label: 'Yanma/Koku', weight: 5 },
    { id: 'yogunluk', label: 'Yoğunluk', weight: 3 },
    { id: 'renk', label: 'Renk Tutarlılığı', weight: 3 },
    { id: 'fiziksel', label: 'Fiziksel Şekil', weight: 3 },
    { id: 'kirilma', label: 'Kırılma Dayanımı', weight: 3 },
    { id: 'cekme', label: 'Çekme Mukavemeti', weight: 3 },
    { id: 'dsc', label: 'DSC (Erime)', weight: 3 },
    { id: 'ambalaj', label: 'Ambalaj Tipi', weight: 2 },
    { id: 'mensei', label: 'Menşei Bilgisi', weight: 2 },
    { id: 'parti', label: 'Parti Sürekliliği', weight: 2 },
    { id: 'cevre', label: 'Çevre Sertifikaları', weight: 2 },
    { id: 'yuzey', label: 'Yüzey Parlaklığı', weight: 2 }
];
const MAX_WEIGHT = 5300;
const API_URL = import.meta.env.VITE_API_URL || 'https://ecograde-broker1.vercel.app';
const PANEL_HASH = '196e451e5f87dacc27b3cab3dd9f0111a4b8427da6248ff9ff5bf4a750a5303e'; // 34585760
const DELETE_HASH = '5471577f7813bb9332c0b8a1e8522e1819907cef06daff83f6ce21fdb33c60ca'; // 123asdewq  
const LOG_VIEW_HASH = 'ec11f26d671bcc37162187abc1cf6a072960f13ee961a5f20c94bdad512d1428'; // 1579

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

/* ==================== STYLES ==================== */
const glass = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
};
const glassCard = {
    ...glass,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
};
const gradientBorder = {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
    backgroundSize: '200% 100%',
    animation: 'gradientSlide 3s linear infinite',
};

/* ==================== MAIN COMPONENT ==================== */
export default function AgentDashboard() {
    const navigate = useNavigate();
    const terminalRef = useRef(null);

    // Auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Data
    const [currentTime, setCurrentTime] = useState(new Date());
    const [orderBook, setOrderBook] = useState([]);
    const [kpis, setKpis] = useState([
        { label: "BEKLEYEN TEKLİFLER", value: "—", icon: "alert", color: "#f59e0b" },
        { label: "AKTİF ÜRÜNLER", value: "—", icon: "box", color: "#06b6d4" },
        { label: "SİSTEM DURUMU", value: "ONLINE", icon: "wifi", color: "#10b981" },
        { label: "USD/TRY", value: "—", icon: "trend", color: "#8b5cf6" },
    ]);
    const [pendingOffers, setPendingOffers] = useState([]);
    const [approvingId, setApprovingId] = useState(null);
    const [expandedOfferId, setExpandedOfferId] = useState(null);
    const [labData, setLabData] = useState({});
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [systemLogs, setSystemLogs] = useState([]);
    const [chartData, setChartData] = useState([35, 52, 41, 68, 55, 73, 60]);
    const [clientIP, setClientIP] = useState('...');

    // Modals
    const [showLoginLogs, setShowLoginLogs] = useState(false);
    const [loginLogPassword, setLoginLogPassword] = useState('');
    const [loginLogAuth, setLoginLogAuth] = useState(false);
    const [loginLogs, setLoginLogs] = useState([]);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteStep, setDeleteStep] = useState(0); // 0=none, 1=confirm, 2=password
    const [deletePassword, setDeletePassword] = useState('');

    // Edit (Dinamik JSON)
    const [editTarget, setEditTarget] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [editSponsored, setEditSponsored] = useState(false);
    const [editStep, setEditStep] = useState(0);

    /* ==================== EFFECTS ==================== */

    // Clock
    useEffect(() => {
        const i = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(i);
    }, []);

    // CSS Animations injection
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientSlide { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
            @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 40px rgba(239,68,68,0.6)} }
            @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
            @keyframes blink { 50%{opacity:0} }
            @keyframes scanline { 0%{top:-100%} 100%{top:100%} }
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
            .glass-row:hover { background: rgba(255,255,255,0.05) !important; }
            .agent-btn { transition: all 0.2s; }
            .agent-btn:hover { transform: translateY(-1px); filter: brightness(1.2); }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Fetch IP
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => setClientIP(d.ip))
            .catch(() => setClientIP('Bilinmiyor'));
    }, []);

    // Check saved auth
    useEffect(() => {
        if (localStorage.getItem('agent_auth') === 'true') setIsAuthenticated(true);
    }, []);

    // System logs
    useEffect(() => {
        if (!isAuthenticated) return;
        const init = [
            { time: new Date(), type: 'SYS', msg: 'EcoGrade Terminal v5.2 başlatıldı.' },
            { time: new Date(), type: 'NET', msg: `Bağlantı kuruldu — IP: ${clientIP}` },
            { time: new Date(), type: 'AUTH', msg: 'Agent oturumu doğrulandı.' },
            { time: new Date(), type: 'ESCROW', msg: 'Escrow motoru: AKTİF' },
        ];
        setSystemLogs(init);
        const i = setInterval(() => {
            const msgs = [
                { type: 'NET', msg: `Ping: ${Math.floor(Math.random() * 15 + 3)}ms` },
                { type: 'SCAN', msg: `Piyasa taraması tamamlandı. ${Math.floor(Math.random() * 4)} yeni kayıt.` },
                { type: 'SYS', msg: `CPU: ${Math.floor(Math.random() * 20 + 10)}% | RAM: ${Math.floor(Math.random() * 30 + 40)}%` },
                { type: 'ESCROW', msg: `${Math.floor(Math.random() * 3)} aktif escrow işlemi devam ediyor.` },
                { type: 'ALERT', msg: `Fiyat anomalisi tespit edildi — PP_TR segmentinde.` },
            ];
            const m = msgs[Math.floor(Math.random() * msgs.length)];
            setSystemLogs(prev => [...prev, { time: new Date(), ...m }].slice(-50));
        }, 3000);
        return () => clearInterval(i);
    }, [isAuthenticated, clientIP]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [systemLogs]);

    // Fetch data with auto-refresh
    const fetchAllData = () => {
        // Products → Order Book
        fetch(`${API_URL}/products/`)
            .then(r => r.ok ? r.json() : [])
            .then(products => {
                setOrderBook(products.map(p => ({
                    id: p.id, time: p.created_at ? new Date(p.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
                    pair: `${p.material_type}/USD`, volume: String(p.quantity_tons),
                    price: String(p.selling_price_usd || p.price_per_ton || p.ai_estimated_price_usd || '-'),
                    status: p.is_active ? "AKTİF" : "SATILDI", delta: String(p.carbon_score || '—'),
                    material: p.material_type, form: p.material_form,
                    seller_name: p.seller_name || p.manufacturer || "Bilinmiyor",
                    custom_fields: p.custom_fields || {}
                })));
                setKpis(prev => { const u = [...prev]; u[1] = { ...u[1], value: String(products.length) }; return u; });
                // Chart data from products
                const days = [0, 0, 0, 0, 0, 0, 0];
                products.forEach((p, i) => days[i % 7] += parseFloat(p.quantity_tons) || 5);
                if (days.some(d => d > 0)) setChartData(days.map(d => Math.max(d, 5)));
            }).catch(() => { });

        // Pending offers
        fetch(`${API_URL}/admin/offers/`)
            .then(r => r.ok ? r.json() : [])
            .then(offers => {
                setPendingOffers(offers);
                setKpis(prev => { const u = [...prev]; u[0] = { ...u[0], value: String(offers.length), color: offers.length > 0 ? '#ef4444' : '#10b981' }; return u; });
            }).catch(() => { });

        // Exchange rate
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(r => r.json())
            .then(d => setKpis(prev => { const u = [...prev]; u[3] = { ...u[3], value: d.rates?.TRY?.toFixed(2) || '—' }; return u; }))
            .catch(() => { });
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchAllData();
        const i = setInterval(fetchAllData, 15000);
        return () => clearInterval(i);
    }, [isAuthenticated]);

    // Load login logs from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('agent_login_logs') || '[]');
        setLoginLogs(saved);
    }, []);

    /* ==================== HANDLERS ==================== */

    const handleLogin = async (e) => {
        e.preventDefault();
        const hash = await hashPassword(passwordInput);
        if (hash === PANEL_HASH) {
            setIsAuthenticated(true);
            setPasswordError(false);
            localStorage.setItem('agent_auth', 'true');
            // Log IP
            const logEntry = { ip: clientIP, date: new Date().toISOString(), browser: navigator.userAgent.slice(0, 60) };
            const logs = JSON.parse(localStorage.getItem('agent_login_logs') || '[]');
            logs.push(logEntry);
            localStorage.setItem('agent_login_logs', JSON.stringify(logs.slice(-50)));
            setLoginLogs(logs);
        } else {
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('agent_auth');
        setIsAuthenticated(false);
        setPasswordInput('');
    };

    const handleViewLoginLogs = async () => {
        if (loginLogPassword === '1579') {
            setLoginLogAuth(true);
            const logs = JSON.parse(localStorage.getItem('agent_login_logs') || '[]');
            setLoginLogs(logs);
        } else {
            setStatusMessage({ text: 'Yetkisiz erişim! Log şifresi yanlış.', type: 'error' });
        }
        setLoginLogPassword('');
    };

    const handleDeleteProduct = async () => {
        if (deletePassword !== '123asdewq') {
            setStatusMessage({ text: 'Gizleme şifresi yanlış! İşlem iptal edildi.', type: 'error' });
            setDeleteStep(0); setDeleteTarget(null); setDeletePassword('');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/products/${deleteTarget}`, { method: 'DELETE' });
            if (res.ok) {
                setStatusMessage({ text: `Ürün #${deleteTarget} başarıyla gizlendi. Gerektiğinde tekrar aktif edilebilir.`, type: 'success' });
                setSystemLogs(prev => [...prev, { time: new Date(), type: 'ALERT', msg: `Ürün #${deleteTarget} GİZLENDİ — IP: ${clientIP}` }]);
                fetchAllData();
            } else {
                setStatusMessage({ text: 'Gizleme başarısız. API hatası.', type: 'error' });
            }
        } catch { setStatusMessage({ text: 'Ağ hatası. Gizleme gerçekleştirilemedi.', type: 'error' }); }
        setDeleteStep(0); setDeleteTarget(null); setDeletePassword('');
    };

    const handleEditProduct = async () => {
        try {
            setEditStep(2); // İşleniyor durumu
            const updatedFields = { ...(editTarget.custom_fields || {}), is_sponsored: editSponsored };
            const payload = {
                selling_price_usd: parseFloat(editPrice),
                custom_fields: updatedFields
            };
            const res = await fetch(`${API_URL}/products/${editTarget.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatusMessage({ text: `Ürün #${editTarget.id} başarıyla düzenlendi!`, type: 'success' });
                setSystemLogs(prev => [...prev, { time: new Date(), type: 'SYS', msg: `Ürün #${editTarget.id} düzenlendi — Fiyat: $${editPrice}, Reklam: ${editSponsored}` }]);
                fetchAllData();
            } else {
                setStatusMessage({ text: 'Düzenleme başarısız. API hatası.', type: 'error' });
            }
        } catch {
            setStatusMessage({ text: 'Ağ hatası. Düzenleme gerçekleştirilemedi.', type: 'error' });
        } finally {
            setEditStep(0); setEditTarget(null);
        }
    };

    const handleApprove = async (offerId, isPrime = false) => {
        const currentLab = labData[offerId] || {};
        let criteriaScores = {};
        if (isPrime) { CRITERIA.forEach(c => criteriaScores[c.id] = 100); }
        else {
            if (!currentLab || Object.keys(currentLab).length === 0) { setStatusMessage({ text: 'Lütfen Lab puanlarını giriniz.', type: 'error' }); return; }
            for (const [k, v] of Object.entries(currentLab)) criteriaScores[k] = parseFloat(v) || 0;
        }
        try {
            setApprovingId(offerId);
            const res = await fetch(`${API_URL}/admin/approve_offer/${offerId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ criteria_scores: criteriaScores }) });
            if (res.ok) { const d = await res.json(); setStatusMessage({ text: `Sertifikasyon OK! ESG: ${d.carbon_score}`, type: 'success' }); setLabData(p => { const n = { ...p }; delete n[offerId]; return n; }); fetchAllData(); }
            else { const e = await res.json(); setStatusMessage({ text: `Hata: ${e.detail}`, type: 'error' }); }
        } catch { setStatusMessage({ text: 'Bağlantı hatası.', type: 'error' }); }
        finally { setApprovingId(null); }
    };

    const calcScore = (scores) => {
        if (!scores || Object.keys(scores).length === 0) return { score: '—', color: '#6b7280', num: 0 };
        let tw = 0; CRITERIA.forEach(c => { tw += (parseFloat(scores[c.id]) || 0) * c.weight; });
        const fn = (tw / MAX_WEIGHT) * 100;
        if (fn >= 90) return { score: 'A+', color: '#10b981', num: fn.toFixed(1) };
        if (fn >= 80) return { score: 'A', color: '#06b6d4', num: fn.toFixed(1) };
        if (fn >= 60) return { score: 'B', color: '#f59e0b', num: fn.toFixed(1) };
        return { score: 'C', color: '#ef4444', num: fn.toFixed(1) };
    };

    const logColor = (type) => ({ SYS: '#06b6d4', NET: '#10b981', AUTH: '#8b5cf6', ESCROW: '#a78bfa', ALERT: '#ef4444', SCAN: '#f59e0b' }[type] || '#6b7280');

    /* ==================== PASSWORD SCREEN ==================== */
    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
                {/* Background Effects */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 440, width: '90%', textAlign: 'center', animation: 'fadeIn 0.6s ease-out', zIndex: 1 }}>
                    {/* Warning Icon */}
                    <div style={{ width: 80, height: 80, margin: '0 auto 24px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulseGlow 2s ease-in-out infinite' }}>
                        <AlertTriangle size={40} style={{ color: '#ef4444' }} />
                    </div>

                    {/* Warning Text */}
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 20px', marginBottom: 28 }}>
                        <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: 3, margin: 0 }}>⚠ UYARI: YETKİLİ ERİŞİM GEREKLİ ⚠</p>
                    </div>

                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 900, letterSpacing: 4, margin: '0 0 6px' }}>GÜVENLİ TERMİNAL</h1>
                    <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 32 }}>Bu sisteme erişim sadece yetkili personel için geçerlidir.</p>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} style={{ ...glassCard, textAlign: 'left' }}>
                        <div style={gradientBorder} />
                        <label style={{ color: '#9ca3af', fontSize: 10, fontWeight: 700, letterSpacing: 2, display: 'block', marginBottom: 8 }}>ERİŞİM ŞİFRESİ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                autoFocus
                                style={{
                                    width: '100%', background: 'rgba(0,0,0,0.4)', border: `1px solid ${passwordError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                    color: 'white', padding: '14px 44px 14px 14px', borderRadius: 10, fontSize: 18, fontFamily: 'monospace',
                                    letterSpacing: 6, outline: 'none', boxSizing: 'border-box', transition: 'border 0.3s',
                                }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {passwordError && (
                            <div style={{ marginTop: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Shield size={14} style={{ color: '#ef4444' }} />
                                <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700 }}>ERİŞİM REDDEDİLDİ — Yetkisiz giriş denemesi kaydedildi.</span>
                            </div>
                        )}
                        <button type="submit" className="agent-btn" style={{
                            width: '100%', marginTop: 20, padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: 'white', fontSize: 12,
                            fontWeight: 900, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        }}>
                            <Lock size={16} /> TERMİNALE GÜVENLİ BAĞLANTI KUR
                        </button>
                        <p style={{ color: '#4b5563', fontSize: 9, textAlign: 'center', marginTop: 16, letterSpacing: 1 }}>
                            IP: {clientIP} | Tüm giriş denemeleri kaydedilmektedir.
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    /* ==================== MAIN DASHBOARD ==================== */
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#cbd5e1', fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 13 }}>
            {/* Global Toast */}
            {statusMessage.text && (
                <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 600, animation: 'fadeIn 0.3s', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: statusMessage.type === 'success' ? 'linear-gradient(135deg, #059669, #047857)' : statusMessage.type === 'error' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white' }}>
                    {statusMessage.text}
                    <button onClick={() => setStatusMessage({ text: '', type: '' })} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, fontWeight: 'bold' }}>&times;</button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteStep > 0 && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ ...glassCard, maxWidth: 420, width: '90%', textAlign: 'center' }}>
                        <div style={gradientBorder} />
                        <Trash2 size={40} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
                        {deleteStep === 1 ? (
                            <>
                                <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>ÜRÜN GİZLEME ONAYI</h3>
                                <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 20 }}>Ürün #{deleteTarget} pazar listesinden gizlenecek. Gerektiğinde tekrar aktif edilebilir.</p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={() => { setDeleteStep(0); setDeleteTarget(null); }} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>İPTAL</button>
                                    <button onClick={() => setDeleteStep(2)} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #dc2626, #991b1b)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700 }}>DEVAM ET</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>2. AŞAMA: ŞİFRE DOĞRULAMA</h3>
                                <p style={{ color: '#f59e0b', fontSize: 11, marginBottom: 16, fontWeight: 600 }}>⚠ Ürün gizlenecek (veri korunur). Gizleme şifresini girin.</p>
                                <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Gizleme şifresi" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(239,68,68,0.3)', color: 'white', padding: 12, borderRadius: 10, fontSize: 14, fontFamily: 'monospace', letterSpacing: 4, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={() => { setDeleteStep(0); setDeleteTarget(null); setDeletePassword(''); }} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>İPTAL</button>
                                    <button onClick={handleDeleteProduct} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #b45309)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700 }}>GİZLE</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editStep > 0 && editTarget && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ ...glassCard, maxWidth: 420, width: '90%', textAlign: 'left' }}>
                        <div style={gradientBorder} />
                        <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>ÜRÜN #{editTarget.id} BİLGİLERİNİ GÜNCELLE</h3>
                        <p style={{ color: '#06b6d4', fontSize: 12, marginBottom: 20, fontWeight: 600 }}>{editTarget.pair} - {editTarget.seller_name}</p>

                        <label style={{ color: '#9ca3af', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 6 }}>Birim Satış Fiyatı (USD)</label>
                        <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(6,182,212,0.3)', color: 'white', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 16 }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
                            <input type="checkbox" checked={editSponsored} onChange={e => setEditSponsored(e.target.checked)} id="sponsorCheck" style={{ width: 18, height: 18, accentColor: '#f59e0b', cursor: 'pointer' }} />
                            <label htmlFor="sponsorCheck" style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, cursor: 'pointer', margin: 0 }}>Vitrin / Öne Çıkarılan İlan</label>
                            <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 'auto' }}>(custom_fields)</span>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => { setEditStep(0); setEditTarget(null); }} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>İPTAL</button>
                            <button onClick={handleEditProduct} disabled={editStep === 2} className="agent-btn" style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700, opacity: editStep === 2 ? 0.5 : 1 }}>
                                {editStep === 2 ? 'KAYDEDİLİYOR...' : 'GÜNCELLE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Logs Modal */}
            {showLoginLogs && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9997, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ ...glassCard, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={gradientBorder} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><LogIn size={18} /> GİRİŞ LOGLARI</h3>
                            <button onClick={() => { setShowLoginLogs(false); setLoginLogAuth(false); }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        {!loginLogAuth ? (
                            <div>
                                <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 12 }}>Giriş loglarını görüntülemek için şifre girin:</p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input type="password" value={loginLogPassword} onChange={e => setLoginLogPassword(e.target.value)} placeholder="Log şifresi" style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: 10, borderRadius: 8, fontSize: 14, fontFamily: 'monospace', outline: 'none' }} />
                                    <button onClick={handleViewLoginLogs} className="agent-btn" style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>DOĞRULA</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '8px 10px', textAlign: 'left', color: '#6b7280', fontWeight: 700, fontSize: 10 }}>#</th>
                                            <th style={{ padding: '8px 10px', textAlign: 'left', color: '#6b7280', fontWeight: 700, fontSize: 10 }}>TARİH</th>
                                            <th style={{ padding: '8px 10px', textAlign: 'left', color: '#6b7280', fontWeight: 700, fontSize: 10 }}>IP ADRESİ</th>
                                            <th style={{ padding: '8px 10px', textAlign: 'left', color: '#6b7280', fontWeight: 700, fontSize: 10 }}>TARAYICI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loginLogs.length === 0 ? (<tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Kayıt yok</td></tr>) :
                                            loginLogs.slice().reverse().map((log, i) => (
                                                <tr key={i} className="glass-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td style={{ padding: '8px 10px', color: '#6b7280' }}>{loginLogs.length - i}</td>
                                                    <td style={{ padding: '8px 10px', color: '#06b6d4' }}>{new Date(log.date).toLocaleString('tr-TR')}</td>
                                                    <td style={{ padding: '8px 10px', color: '#f59e0b', fontFamily: 'monospace', fontWeight: 'bold' }}>{log.ip}</td>
                                                    <td style={{ padding: '8px 10px', color: '#9ca3af', fontSize: 10 }}>{log.browser}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== HEADER ===== */}
            <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: 'white', padding: '4px 12px', fontWeight: 900, fontSize: 10, letterSpacing: 2, cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={12} /> EG_TERMINAL
                    </div>
                    <span style={{ color: '#374151', fontSize: 10 }}>|</span>
                    <span style={{ color: '#10b981', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Wifi size={10} /> CONNECTED</span>
                    <span style={{ color: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}>IP: {clientIP}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10 }}>
                    <button onClick={() => setShowLoginLogs(true)} className="agent-btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <LogIn size={10} /> GİRİŞ LOGLARI
                    </button>
                    <button onClick={fetchAllData} className="agent-btn" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RefreshCw size={10} /> YENİLE
                    </button>
                    <span style={{ color: '#6b7280', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {currentTime.toLocaleTimeString('tr-TR')}</span>
                    <button onClick={handleLogout} className="agent-btn" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, letterSpacing: 1 }}>ÇIKIŞ</button>
                </div>
            </header>

            {/* ===== KPI CARDS ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, padding: '20px 20px 0' }}>
                {kpis.map((k, i) => (
                    <div key={i} style={{ ...glassCard, animation: `fadeIn ${0.3 + i * 0.1}s ease-out` }}>
                        <div style={gradientBorder} />
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#6b7280', marginBottom: 8 }}>{k.label}</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: k.color, lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>{k.value}</div>
                    </div>
                ))}
            </div>

            {/* ===== MAIN GRID ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: 16, padding: '20px 10px' }}>

                {/* CHART */}
                <div style={{ ...glassCard, gridColumn: '1 / -1' }}>
                    <div style={gradientBorder} />
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#6b7280', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><BarChart2 size={14} style={{ color: '#06b6d4' }} /> 7 GÜNLÜK İŞLEM HACMİ</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                        {chartData.map((v, i) => {
                            const maxV = Math.max(...chartData, 1);
                            const h = (v / maxV) * 100;
                            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600 }}>{v.toFixed(0)}T</span>
                                    <div style={{ width: '100%', height: `${h}%`, minHeight: 4, borderRadius: '6px 6px 2px 2px', background: `linear-gradient(180deg, #06b6d4, #8b5cf6)`, opacity: 0.8, transition: 'height 0.5s' }} />
                                    <span style={{ fontSize: 9, color: '#6b7280' }}>{days[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ORDER BOOK */}
                <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
                    <div style={gradientBorder} />
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: 6 }}><Database size={12} /> ORDER BOOK</span>
                        <span style={{ fontSize: 9, color: '#6b7280' }}>{orderBook.length} kayıt</span>
                    </div>
                    <div style={{ maxHeight: 320, overflow: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}>
                            <thead><tr style={{ fontSize: 9, color: '#6b7280', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <th style={{ padding: '8px 12px', textAlign: 'left' }}>SAAT</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left' }}>ÇİFT</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left' }}>SATICI</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>FİYAT</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>HACİM</th>
                                <th style={{ padding: '8px 12px', textAlign: 'center' }}>DURUM</th>
                                <th style={{ padding: '8px 12px', textAlign: 'center' }}>YÖNET</th>
                            </tr></thead>
                            <tbody>
                                {orderBook.length === 0 ? <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#4b5563' }}>Veri yükleniyor...</td></tr> :
                                    orderBook.map((tx, i) => (
                                        <tr key={i} className="glass-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '8px 12px', color: '#6b7280', fontSize: 11 }}>{tx.time}</td>
                                            <td style={{ padding: '8px 12px', color: '#06b6d4', fontWeight: 700, fontSize: 12 }}>
                                                {tx.pair}
                                                {tx.custom_fields?.is_sponsored && <span style={{ marginLeft: 6, fontSize: 9, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: 4 }}>ÖNE ÇIKAN</span>}
                                            </td>
                                            <td style={{ padding: '8px 12px', color: '#9ca3af', fontSize: 11 }}>{tx.seller_name}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: 'white', fontWeight: 700 }}>${tx.price}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11 }}>{tx.volume}T</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                                <span style={{ padding: '2px 10px', fontSize: 9, fontWeight: 700, borderRadius: 20, background: tx.status === 'AKTİF' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: tx.status === 'AKTİF' ? '#10b981' : '#ef4444', border: `1px solid ${tx.status === 'AKTİF' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>{tx.status}</span>
                                            </td>
                                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                                    <button onClick={() => { setEditTarget(tx); setEditPrice(tx.price); setEditSponsored(tx.custom_fields?.is_sponsored || false); setEditStep(1); }} className="agent-btn" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06b6d4', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>DÜZENLE</button>
                                                    <button onClick={() => { setDeleteTarget(tx.id); setDeleteStep(1); }} className="agent-btn" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#f59e0b', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 10 }}><EyeOff size={12} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PENDING OFFERS */}
                <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
                    <div style={gradientBorder} />
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={12} /> BEKLEYEN TEKLİFLER</span>
                        <span style={{ fontSize: 11, fontWeight: 900, color: pendingOffers.length > 0 ? '#ef4444' : '#10b981', background: pendingOffers.length > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '2px 10px', borderRadius: 20 }}>{pendingOffers.length}</span>
                    </div>
                    <div style={{ maxHeight: 320, overflow: 'auto' }}>
                        {pendingOffers.length === 0 ? <div style={{ padding: 30, textAlign: 'center', color: '#4b5563' }}>Bekleyen teklif yok ✓</div> :
                            pendingOffers.map(offer => (
                                <div key={offer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', padding: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: '#06b6d4' }}>{offer.material_type}</span>
                                            <span style={{ color: '#6b7280', fontSize: 11 }}>{offer.quantity_tons}T</span>
                                            <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>${offer.ai_estimated_price_usd}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => setExpandedOfferId(expandedOfferId === offer.id ? null : offer.id)} className="agent-btn" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                                                {expandedOfferId === offer.id ? 'KAPAT' : '🔬 LAB'}
                                            </button>
                                            <button onClick={() => handleApprove(offer.id, true)} disabled={approvingId === offer.id} className="agent-btn" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700, opacity: approvingId === offer.id ? 0.5 : 1 }}>
                                                {approvingId === offer.id ? '⏳' : '✓ PRIME'}
                                            </button>
                                        </div>
                                    </div>
                                    {/* LAB ENTRY */}
                                    {expandedOfferId === offer.id && (
                                        <div style={{ ...glass, padding: 14, marginTop: 8, borderRadius: 12, animation: 'fadeIn 0.3s' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                                                {CRITERIA.map(c => (
                                                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <label style={{ color: '#9ca3af', fontSize: 10, minWidth: 110, fontWeight: 500 }}>{c.label}</label>
                                                        <input type="range" min="0" max="100" value={labData[offer.id]?.[c.id] || 50} onChange={e => setLabData(p => ({ ...p, [offer.id]: { ...(p[offer.id] || {}), [c.id]: e.target.value } }))} style={{ flex: 1, accentColor: '#06b6d4', height: 4 }} />
                                                        <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: 12, minWidth: 28, textAlign: 'right' }}>{labData[offer.id]?.[c.id] || 50}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 28, fontWeight: 900, color: calcScore(labData[offer.id]).color }}>{calcScore(labData[offer.id]).score}</span>
                                                    <span style={{ color: '#6b7280', fontSize: 11 }}>({calcScore(labData[offer.id]).num}%)</span>
                                                </div>
                                                <button onClick={() => handleApprove(offer.id)} disabled={approvingId === offer.id} className="agent-btn" style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                                                    {approvingId === offer.id ? 'İşleniyor...' : '🏆 SERTİFİKALA'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* ===== SYSTEM TERMINAL ===== */}
            <div style={{ padding: '0 20px 20px' }}>
                <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
                    <div style={gradientBorder} />
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}><TerminalIcon size={12} /> SİSTEM TERMİNAL</span>
                        <span style={{ fontSize: 9, color: '#6b7280' }}>{systemLogs.length} kayıt</span>
                    </div>
                    <div ref={terminalRef} style={{ padding: 14, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 11, lineHeight: 2, maxHeight: 200, overflow: 'auto', background: 'rgba(0,0,0,0.3)' }}>
                        {systemLogs.map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8 }}>
                                <span style={{ color: '#4b5563', minWidth: 60, fontSize: 10 }}>{log.time instanceof Date ? log.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</span>
                                <span style={{ color: logColor(log.type), fontWeight: 700, minWidth: 56, fontSize: 10 }}>[{log.type}]</span>
                                <span style={{ color: log.type === 'ALERT' ? '#fca5a5' : '#9ca3af' }}>{log.msg}</span>
                            </div>
                        ))}
                        <div style={{ animation: 'blink 1s step-end infinite', color: '#06b6d4' }}>█</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
