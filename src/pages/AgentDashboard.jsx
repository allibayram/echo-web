import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, MapPin, Database, ChevronRight, Terminal as TerminalIcon, BarChart2, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function AgentDashboard() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date().toISOString());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const [pendingOffers, setPendingOffers] = useState([]);
    const [approvingId, setApprovingId] = useState(null);
    const [expandedOfferId, setExpandedOfferId] = useState(null);
    const [labData, setLabData] = useState({});

    // YENİ: Dinamik Terminal Logları
    const [systemLogs, setSystemLogs] = useState([
        "> SYSTEM KERNEL INITIALIZED",
        "> SECURE HANDSHAKE COMPLETED",
        "> LISTENING FOR GLOBAL QUOTES..."
    ]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fakeEvents = [
            "New incoming data feed from Rotterdam Port",
            "[ALERT] High volatility detected in ABS pricing",
            "[ESCROW] Smart contract verified for LO-5043",
            "MFI test result broadcasted for PP-H",
            "Seller rating updated: Company #12",
            "[ALERT] Server ping latency spiked to 240ms"
        ];

        const interval = setInterval(() => {
            if (Math.random() > 0.4) {
                const randomEvent = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
                const timestamp = new Date().toISOString().substring(11, 19);
                setSystemLogs(prev => {
                    const newLogs = [...prev, `[${timestamp}] ${randomEvent}`];
                    return newLogs.slice(-20); // Sadece son 20 logu tut
                });
            }
        }, 1500); // Her 1.5 saniyede bir %60 ihtimalle yeni log

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Check localStorage on mount
    useEffect(() => {
        if (localStorage.getItem('agent_auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // YENİ: Zaman sayacı (Hook'lar early return'den ÖNCE çağrılmalı)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toISOString()), 1000);
        return () => clearInterval(timer);
    }, []);

    // YENİ: Pending offers fetch (Hook'lar early return'den ÖNCE çağrılmalı)
    const fetchPendingOffers = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/admin/offers/`);
            if (res.ok) {
                const data = await res.json();
                setPendingOffers(data);
            }
        } catch (error) {
            console.error("Failed to fetch pending offers", error);
        }
    };

    useEffect(() => {
        fetchPendingOffers();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        // Şifre hash ile karşılaştırılıyor (plaintext kaynak kodda görünmez)
        const encoder = new TextEncoder();
        const data = encoder.encode(passwordInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        // SHA-256 of the valid agent terminal password
        const VALID_HASH = '0fe27680694c371a9226764e1ccb8150ddcfe7a0efbf82940609d320c29b72ae';
        if (hashHex === VALID_HASH) {
            setIsAuthenticated(true);
            setPasswordError(false);
            localStorage.setItem('agent_auth', 'true');
        } else {
            setPasswordError(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#060B14] pt-32 pb-20 px-4 md:px-8 font-sans flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay pointer-events-none"></div>
                <div className="max-w-md w-full bg-[#0A101D] border border-[#1E293B] p-8 rounded-2xl relative z-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <ShieldCheck size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-widest uppercase">Yetkili Personel</h2>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Bloomberg B2B Terminal sistemine erişmek için şifrenizi giriniz.</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <input
                                type="password"
                                className={`w-full bg-[#060B14] border-b-2 border-gray-700 text-white text-center tracking-widest text-3xl font-mono py-4 focus:outline-none focus:border-red-500 transition-colors ${passwordError ? 'border-red-500 text-red-500' : ''}`}
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                                autoFocus
                            />
                            {passwordError && <p className="text-red-500 text-[10px] text-center mt-3 uppercase tracking-widest animate-pulse font-bold">Erişim reddedildi. Yetkisiz giriş.</p>}
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <TerminalIcon size={16} /> Terminale Güvenli Bağlantı Kur
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const calculateAdvancedScore = (scores) => {
        if (!scores || Object.keys(scores).length === 0) return { score: '-', color: 'text-gray-500', bg: 'bg-gray-800 border-[#1E293B]', numeric: 0 };

        let totalWeighted = 0;
        CRITERIA.forEach(c => {
            const val = parseFloat(scores[c.id]) || 0;
            totalWeighted += val * c.weight;
        });

        const finalNumeric = (totalWeighted / MAX_WEIGHT) * 100;

        if (finalNumeric >= 90) return { score: 'A+', color: 'text-emerald-500', bg: 'bg-emerald-500/20 border-emerald-500', numeric: finalNumeric.toFixed(1) };
        if (finalNumeric >= 80) return { score: 'A', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500', numeric: finalNumeric.toFixed(1) };
        if (finalNumeric >= 60) return { score: 'B', color: 'text-amber-500', bg: 'bg-amber-500/20 border-amber-500', numeric: finalNumeric.toFixed(1) };
        if (finalNumeric > 0) return { score: 'C', color: 'text-red-500', bg: 'bg-red-500/20 border-red-500', numeric: finalNumeric.toFixed(1) };
        return { score: '-', color: 'text-gray-500', bg: 'bg-gray-800 border-[#1E293B]', numeric: 0 };
    };

    // Hook'lar yukarıya taşındı (early return'den önce)

    const handleApprove = async (offerId, isPrime = false) => {
        const currentLab = labData[offerId] || {};
        let criteriaScores = {};

        if (isPrime) {
            CRITERIA.forEach(c => criteriaScores[c.id] = 100);
        } else {
            if (!currentLab || Object.keys(currentLab).length === 0) {
                alert("Lütfen Laboratuvar test puanlarını (0-100) giriniz.");
                return;
            }
            for (const [key, val] of Object.entries(currentLab)) {
                criteriaScores[key] = parseFloat(val) || 0;
            }
        }

        try {
            setApprovingId(offerId);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/admin/approve_offer/${offerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    criteria_scores: criteriaScores
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Sertifikasyon Başarılı! Atanan ESG Puanı: ${data.carbon_score}`);
                setLabData(prev => {
                    const newLabData = { ...prev };
                    delete newLabData[offerId];
                    return newLabData;
                });
                fetchPendingOffers(); // listeyi yenile
            } else {
                const err = await response.json();
                alert(`Hata: ${err.detail}`);
            }
        } catch (e) {
            console.error(e);
            alert("Sistem Hatası: Bağlantı kurulamadı.");
        } finally {
            setApprovingId(null);
        }
    };

    // --- Strict Data Mock ---
    const orderBook = [
        { id: "TX-9921", time: "14:02:11", pair: "PP/USD", type: "BUY", client: "SASA_PLAST", volume: "24.5", price: "1230.50", status: "FILLED", delta: "+1.2%" },
        { id: "TX-9922", time: "14:05:33", pair: "HDPE/USD", type: "SELL", client: "EUROSTAR", volume: "100.0", price: "980.00", status: "PENDING", delta: "-0.4%" },
        { id: "TX-9923", time: "14:12:05", pair: "PVC/USD", type: "BUY", client: "PETKIM_TR", volume: "12.0", price: "885.20", status: "ESCROW", delta: "+0.1%" },
        { id: "TX-9924", time: "14:15:59", pair: "LDPE/USD", type: "SELL", client: "GLOBAL_P", volume: "55.5", price: "1140.00", status: "DISPUTE", delta: "-2.1%" },
        { id: "TX-9925", time: "14:18:22", pair: "PET/USD", type: "BUY", client: "RECYCLE_SA", volume: "200.0", price: "720.80", status: "FILLED", delta: "+4.5%" },
    ];


    const kpis = [
        { label: "24H VOL (USD)", value: "1,245,600", trend: "+12.4%", color: "text-emerald-500" },
        { label: "ACTIVE ESCROW", value: "$450,200", trend: "STABLE", color: "text-blue-400" },
        { label: "PENDING DISPUTES", value: "3", trend: "ACTION REQ", color: "text-red-500" },
        { label: "INDEX VARIANCE", value: "2.1%", trend: "-0.4%", color: "text-amber-500" },
    ];

    return (
        <div className="min-h-screen bg-[#03070E] text-[#A0AEC0] font-mono text-xs overflow-hidden flex flex-col selection:bg-blue-900/50">
            {/* TERMINAL HEADER */}
            <header className="border-b border-[#1E293B] bg-[#050A15] p-2 flex justify-between items-center z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white px-2 py-0.5 font-bold tracking-widest text-[10px] uppercase flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Zap size={10} className="animate-pulse" /> EG_TERMINAL_V5
                    </div>
                    <div className="flex items-center gap-3 border-l border-[#1E293B] pl-4">
                        <span className="text-gray-500">OP_ID:</span>
                        <span className="text-white font-bold">AGT_007</span>
                        <span className="text-gray-500 ml-2">NODE:</span>
                        <span className="text-emerald-500">TR_IST_01</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">SYS_TIME:</span>
                        <span className="text-blue-400 font-bold tracking-wider">{currentTime.replace('T', ' ').slice(0, 23)}</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <span className="text-emerald-500 font-bold uppercase text-[9px]">Live Connect</span>
                    </div>
                </div>
            </header>

            {/* TICKER TAPE */}
            <div className="bg-[#0A101D] border-b border-[#1E293B] flex overflow-hidden whitespace-nowrap py-1">
                <div className="animate-ticker inline-block font-bold text-[10px]" style={{ animationDuration: '20s' }}>
                    <span className="mx-4 text-emerald-500">▲ PP_TR $1240 (+1.2%)</span>
                    <span className="mx-4 text-red-500">▼ HDPE_EU $1080 (-0.4%)</span>
                    <span className="mx-4 text-emerald-500">▲ PET_FLK $950 (+2.1%)</span>
                    <span className="mx-4 text-gray-400">► LDPE_AS $1110 (0.0%)</span>
                    <span className="mx-4 text-emerald-500">▲ PVC_K67 $895 (+0.8%)</span>
                    <span className="mx-4 text-red-500">▼ EPS_REG $1450 (-1.5%)</span>
                    {/* Duplicate for infinite effect */}
                    <span className="mx-4 text-emerald-500">▲ PP_TR $1240 (+1.2%)</span>
                    <span className="mx-4 text-red-500">▼ HDPE_EU $1080 (-0.4%)</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-60px)] overflow-hidden">

                {/* LEFT: MAIN DATA TERMINAL */}
                <div className="flex-1 border-r border-[#1E293B] flex flex-col bg-[#060B14] overflow-hidden">

                    {/* TOP: MARKET CHARTS & METRICS */}
                    <div className="h-[280px] border-b border-[#1E293B] flex flex-col">
                        <div className="p-2 border-b border-[#1E293B] bg-[#0B1221] flex justify-between items-center text-white/80 font-bold uppercase tracking-widest text-[10px]">
                            <span><Activity size={12} className="inline mr-2 text-blue-500" /> GLOBAL_MARKET_ANALYTICS</span>
                            <div className="flex gap-2">
                                <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> LIVE_DATAFEED</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 divide-x divide-[#1E293B] p-4 gap-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] relative">
                            <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay pointer-events-none"></div>

                            {/* CHART 1: VOLATILITY / VOLUME */}
                            <div className="flex flex-col h-full justify-between relative z-10 pr-2">
                                <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-2 uppercase">7-Day Traded Volume (kMT)</div>
                                <div className="flex-1 flex items-end justify-between gap-1 mt-2">
                                    {[30, 45, 25, 60, 80, 55, 90, 40, 75, 50, 85, 95, 65, 100].map((h, i) => (
                                        <div key={i} className="w-full h-full relative group cursor-crosshair flex items-end">
                                            <div className="absolute opacity-0 group-hover:opacity-100 -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold px-1 rounded z-20 pointer-events-none transition-opacity">
                                                {h}k
                                            </div>
                                            <div className={`w-full rounded-t-sm transition-all duration-300 ${i === 13 ? 'bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]' : i > 10 ? 'bg-blue-500 hover:bg-white' : 'bg-[#1E293B] hover:bg-gray-500'}`} style={{ height: `${h}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-2 border-t border-[#1E293B] pt-1">
                                    <span>T-14</span>
                                    <span>T-0 (NOW)</span>
                                </div>
                            </div>

                            {/* CHART 2: MATERIAL DISTRIBUTION */}
                            <div className="flex flex-col h-full px-4 relative z-10">
                                <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-2 uppercase flex justify-between">
                                    <span>Polymer Index Dist.</span>
                                    <Database size={12} className="text-gray-600" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-3">
                                    {[
                                        { label: "PE (PE-HD, PE-LD)", pct: 42, color: "bg-blue-500" },
                                        { label: "PP (Homo, Copo)", pct: 35, color: "bg-emerald-500" },
                                        { label: "PVC & Engineering", pct: 15, color: "bg-amber-500" },
                                        { label: "Recycled (rPET, rPP)", pct: 8, color: "bg-purple-500" }
                                    ].map((cat, i) => (
                                        <div key={i} className="flex flex-col gap-1 w-full relative group cursor-pointer">
                                            <div className="flex justify-between text-[9px] font-bold">
                                                <span className="text-gray-400 group-hover:text-white transition-colors">{cat.label}</span>
                                                <span className="text-white">{cat.pct}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                                                <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CHART 3: ESG & CARBON SAVINGS */}
                            <div className="flex flex-col h-full pl-4 justify-between relative z-10">
                                <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-2 uppercase flex justify-between">
                                    <span>YTD Carbon Savings</span>
                                    <span className="text-emerald-500 border border-emerald-500/30 px-1 rounded bg-emerald-500/10">ESG_V2</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center relative">
                                    <div className="w-24 h-24 rounded-full border-[6px] border-[#1E293B] border-r-emerald-500 border-t-emerald-500 border-l-emerald-500/50 flex items-center justify-center transform rotate-45 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <div className="-rotate-45 text-center flex flex-col items-center">
                                            <span className="text-emerald-500 font-bold text-2xl leading-none tracking-tighter">84</span>
                                            <span className="text-[8px] text-gray-500 font-bold mt-1 uppercase">kt CO2</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-32 h-32 rounded-full border border-emerald-500/10 border-dashed animate-[spin_20s_linear_infinite]"></div>
                                    </div>
                                </div>
                                <div className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 border-t border-[#1E293B] pt-1 flex justify-between">
                                    <span>Target: <span className="text-white">100 kt</span></span>
                                    <span>Pct: <span className="text-emerald-500">%84.0</span></span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* BOTTOM: ORDER BOOK */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-[#1E293B] bg-[#0B1221] flex justify-between items-center text-white/80 font-bold uppercase tracking-widest text-[10px]">
                            <span><BarChart2 size={12} className="inline mr-2 text-blue-500" /> Live Order Book (Listing Tahtası)</span>
                            <div className="flex gap-2">
                                <span onClick={() => alert('Filtre paneli aktif edilecek.')} className="px-2 py-0.5 border border-[#1E293B] bg-[#050A15] hover:bg-blue-900/30 cursor-pointer transition-colors">FILTER</span>
                                <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer transition-colors">EXPORT_CSV</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0A101D] border-b border-[#1E293B] text-[10px] text-gray-500 z-10 shadow-md shadow-black/20">
                                    <tr>
                                        <th className="py-2 px-3 font-normal tracking-widest">TX_ID</th>
                                        <th className="py-2 px-3 font-normal tracking-widest">TIME</th>
                                        <th className="py-2 px-3 font-normal tracking-widest">PAIR</th>
                                        <th className="py-2 px-3 font-normal tracking-widest">TYPE</th>
                                        <th className="py-2 px-3 font-normal tracking-widest">VOL (T)</th>
                                        <th className="py-2 px-3 font-normal text-right tracking-widest">PRICE (USD)</th>
                                        <th className="py-2 px-3 font-normal text-right tracking-widest">DELTA</th>
                                        <th className="py-2 px-3 font-normal text-center tracking-widest">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderBook.map((tx, idx) => (
                                        <tr key={idx} className="border-b border-[#1E293B]/50 hover:bg-[#0A1224] transition-colors cursor-crosshair">
                                            <td className="py-2 px-3 text-blue-400">{tx.id}</td>
                                            <td className="py-2 px-3 text-gray-400">{tx.time}</td>
                                            <td className="py-2 px-3 font-bold text-gray-200">{tx.pair}</td>
                                            <td className={`py-2 px-3 font-bold ${tx.type === 'BUY' ? 'text-emerald-500' : 'text-red-500'}`}>{tx.type}</td>
                                            <td className="py-2 px-3 text-gray-300">{tx.volume}</td>
                                            <td className="py-2 px-3 text-right font-bold text-white">{tx.price}</td>
                                            <td className={`py-2 px-3 text-right ${tx.delta.includes('+') ? 'text-emerald-500' : tx.delta.includes('-') ? 'text-red-500' : 'text-gray-500'}`}>{tx.delta}</td>
                                            <td className="py-2 px-3 text-center">
                                                <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest ${tx.status === 'FILLED' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' :
                                                    tx.status === 'PENDING' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                                                        tx.status === 'DISPUTE' ? 'border-red-500/50 text-red-500 bg-red-500/20 animate-pulse' :
                                                            'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT: AGENT CONTROLS & LOGS */}
                <div className="w-full lg:w-[400px] flex flex-col bg-[#050A15]">
                    {/* KPI GRID */}
                    <div className="grid grid-cols-2 gap-px bg-[#1E293B] border-b border-[#1E293B]">
                        {kpis.map((kpi, idx) => (
                            <div key={idx} className="bg-[#050A15] p-3 flex flex-col justify-between">
                                <span className="text-[10px] text-gray-500 font-medium mb-1">{kpi.label}</span>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-white">{kpi.value}</span>
                                    <span className={`text-[10px] font-bold ${kpi.color}`}>{kpi.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ACTION PANEL */}
                    <div className="p-4 border-b border-[#1E293B]">
                        <div className="text-[10px] text-gray-500 mb-3 tracking-widest uppercase flex items-center justify-between">
                            <span>Agent Action Required (Lab Onayları)</span>
                            <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[9px] font-bold">{pendingOffers.length} BEKLEYEN</span>
                        </div>

                        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                            <div className="min-w-fit px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] border border-emerald-500/30 font-bold whitespace-nowrap">A+ (Kusursuz ±%5)</div>
                            <div className="min-w-fit px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] border border-blue-500/30 font-bold whitespace-nowrap">A (Kabul Edilebilir ±%15)</div>
                            <div className="min-w-fit px-2 py-1 bg-amber-500/10 text-amber-500 text-[9px] border border-amber-500/30 font-bold whitespace-nowrap">B (Standart ±%25)</div>
                            <div className="min-w-fit px-2 py-1 bg-red-500/10 text-red-500 text-[9px] border border-red-500/30 font-bold whitespace-nowrap">C (Off-Grade &gt;%25)</div>
                        </div>

                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto no-scrollbar pb-4">
                            {pendingOffers.length === 0 ? (
                                <div className="text-gray-500 text-[10px] italic text-center py-6 border border-[#1E293B] border-dashed">Bekleyen Numune Testi Bulunmamaktadır.</div>
                            ) : (
                                pendingOffers.map(offer => {
                                    const currentLab = labData[offer.id] || {};
                                    const scoreObj = calculateAdvancedScore(currentLab);

                                    const materialTypeStr = offer?.material_type || 'Bilinmeyen Malzeme';
                                    const materialFormStr = offer?.material_form || 'Belirtilmemiş';

                                    const isRecycle = materialTypeStr.startsWith('r') || materialTypeStr.includes('Recycle') || materialTypeStr.toLowerCase().includes('recycle') || materialTypeStr.toLowerCase().includes('off');
                                    const isOffGrade = materialFormStr === 'OffGrade' || materialFormStr === 'Capak' || materialFormStr === 'Balya';
                                    const isPrime = !isRecycle && !isOffGrade;

                                    return (
                                        <div key={offer.id} className="border border-[#1E293B] bg-[#0A101D] p-3 relative hover:border-blue-500/50 transition-colors">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-blue-400 font-bold text-[11px]"><AlertTriangle size={12} className="inline mr-1" /> REQ_ID: VTY-{offer.id}</span>
                                                <span className="text-gray-500 text-[10px]">{offer.created_at ? offer.created_at.slice(11, 16) : ''}</span>
                                            </div>

                                            {/* Satıcı ve Fiyat Bilgisi */}
                                            <div className="mb-3 pb-3 border-b border-[#1E293B]">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-400 text-[10px]">Satıcı ID: <span className="text-white font-bold">{offer.seller_id || 1}</span></span>
                                                    <span className="text-gray-400 text-[10px]">AI Fiyat: <span className="text-emerald-500 font-bold">${offer.ai_estimated_price_usd || 1050}/T</span></span>
                                                </div>
                                                <p className="text-white text-[12px] font-bold">
                                                    {materialTypeStr} <span className="text-gray-400 font-normal">({materialFormStr === 'OffGrade' ? 'Off-Grade Granül' : materialFormStr === 'Capak' ? 'Kırık/Çapak' : materialFormStr === 'Balya' ? 'Balya/Hurda' : materialFormStr})</span> <span className="text-blue-400 ml-1">[{offer.quantity_tons || 0} Ton]</span>
                                                </p>
                                            </div>

                                            {/* Dinamik Score */}
                                            <div className="flex gap-3 mb-4 items-center">
                                                <div className="flex-1 bg-[#050A15] border border-[#1E293B] p-2 rounded-sm flex items-center justify-between px-4">
                                                    <div>
                                                        <div className="text-[9px] text-gray-500 tracking-widest uppercase mb-1">Satıcı Beyanı</div>
                                                        <div className="text-gray-300 text-[10px] font-bold">MFI: <span className="text-white">{offer.declared_mfi}</span> | YGN: <span className="text-white">{offer.declared_density}</span></div>
                                                    </div>
                                                    {scoreObj.numeric > 0 && (
                                                        <div className="text-right">
                                                            <div className="text-[9px] text-emerald-500 font-bold">AĞIRLIKLI SKOR</div>
                                                            <div className="text-white text-[14px] font-bold">{scoreObj.numeric} PUAN</div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`w-14 h-14 flex flex-col items-center justify-center border ${scoreObj.bg} ${scoreObj.color} rounded-sm shadow-inner shrink-0`}>
                                                    <div className="text-[7px] uppercase tracking-widest opacity-80 mb-0.5">ESG SKORU</div>
                                                    <div className="font-bold text-xl leading-none">{scoreObj.score}</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setExpandedOfferId(expandedOfferId === offer.id ? null : offer.id)}
                                                className="w-full bg-[#1E293B] hover:bg-[#2A3B52] border border-transparent font-bold text-[10px] text-gray-300 py-2 mb-2 uppercase transition-colors"
                                            >
                                                {expandedOfferId === offer.id ? 'İŞLEM PANELİNİ GİZLE' : (isPrime ? 'ORİJİNAL ÜRÜN (PRIME) - HIZLI ONAY' : 'OFF-GRADE / RECYCLE - LAB TESTİNE BAŞLA')}
                                            </button>

                                            {/* Genişletilmiş Laboratuvar Paneli */}
                                            {expandedOfferId === offer.id && (
                                                <div className="bg-[#010409] p-4 border border-[#1E293B] mt-2 mb-2 rounded-lg">
                                                    {isPrime ? (
                                                        <div className="flex flex-col items-center justify-center py-6 text-center">
                                                            <ShieldCheck size={40} className="text-emerald-500 mb-3" />
                                                            <h4 className="text-white text-lg font-bold mb-1">Orijinal (Prime) Ürün Onayı</h4>
                                                            <p className="text-gray-400 text-xs mb-6 max-w-sm">Bu ürün Orijinal kategorisinde olduğu için 16 kriterli detaylı laboratuvar testine tabi tutulmasına gerek yoktur. Beyan edilen verilerle onaylanabilir.</p>
                                                            <button
                                                                onClick={() => handleApprove(offer.id, true)}
                                                                disabled={approvingId === offer.id}
                                                                className="px-6 py-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center shadow-lg shadow-emerald-500/10"
                                                            >
                                                                {approvingId === offer.id ? <ShieldCheck size={16} className="animate-spin mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
                                                                ORİJİNAL ÜRÜNÜ ONAYLA VE PAZARA SÜR
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="text-xs text-blue-400 font-bold mb-4 border-b border-[#1E293B] pb-2 flex items-center gap-2">
                                                                OFF-GRADE / GERİ DÖNÜŞÜM KALİTE KONTROL FORMU (0-100 Puan)
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                                {CRITERIA.map(crit => (
                                                                    <div key={crit.id} className="flex flex-col bg-[#050A15] p-2 rounded border border-[#1E293B]">
                                                                        <label className="text-[10px] text-gray-400 mb-1 flex justify-between">
                                                                            <span>{crit.label}</span>
                                                                            <span className="text-emerald-500/50">x{crit.weight}</span>
                                                                        </label>
                                                                        <input
                                                                            type="number" min="0" max="100" placeholder="0-100"
                                                                            value={currentLab[crit.id] || ''}
                                                                            onChange={e => setLabData({ ...labData, [offer.id]: { ...currentLab, [crit.id]: e.target.value } })}
                                                                            className="bg-transparent text-white text-sm font-bold p-1 focus:outline-none placeholder-gray-700"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-end pt-3 border-t border-[#1E293B]">
                                                                <button
                                                                    onClick={() => handleApprove(offer.id, false)}
                                                                    disabled={approvingId === offer.id}
                                                                    className={`px-5 py-2.5 ${(scoreObj.numeric > 0) ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/50 shadow-blue-500/10' : 'bg-[#1E293B] text-gray-500 cursor-not-allowed border-transparent'} border font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center shadow-lg`}
                                                                >
                                                                    {approvingId === offer.id ? <ShieldCheck size={16} className="animate-spin mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
                                                                    TEST SONUÇLARINI ONAYLA VE PAZARA SÜR
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* TERMINAL ENGINES LOG */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-black/50">
                        <div className="p-2 border-b border-[#1E293B] text-[10px] text-gray-500 tracking-widest uppercase flex items-center bg-[#010409]">
                            <TerminalIcon size={12} className="mr-2" /> System Event Log
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto font-mono text-[9px] text-[#00FF00]/80 leading-relaxed font-semibold">
                            {systemLogs.map((log, i) => (
                                <div key={i} className="mb-1 hover:text-white transition-colors">
                                    {log.startsWith('[ALERT]') ? <span className="text-red-500">{log}</span> :
                                        log.startsWith('[ESCROW]') ? <span className="text-blue-400">{log}</span> :
                                            log}
                                </div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
