import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Search, Filter, ShieldCheck, Activity, PackageSearch, Factory, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// Hero Section Component (V5 - Gerçek Logo ve Premium Anlatım)
const HeroSection = ({ scrollToMarket }) => {
    return (
        <section className="min-h-[75vh] md:min-h-[90vh] flex flex-col items-center justify-center relative px-4 md:px-6 overflow-hidden">
            {/* YENİ NESİL ANİMASYONLU ARKA PLAN (VİDEO YERİNE) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#020813]">
                {/* Animated gradient mesh */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 blur-[150px] rounded-full mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]"></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-900/30 blur-[100px] rounded-full mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]"></div>

                {/* Dokusal Grid Kaplaması */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay z-[1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='60' fill='none' stroke='rgba(255,255,255,0.03)'/%3E%3C/svg%3E")` }}></div>

                {/* Koyu Karartma Katmanı (İçeriğin okunabilirliği için) */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background z-[2]"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center mt-[-10vh]">
                {/* Şık, kutusuz, bembeyaz logoya dönüştürülmüş ve yavaşlatılmış animasyon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="mb-8 md:mb-14 w-[14rem] md:w-[26rem] relative"
                >
                    {/* Arka plan ışık huzmesi */}
                    <div className="absolute inset-0 bg-white/10 blur-[80px] rounded-full scale-150 pointer-events-none"></div>
                    <img
                        src="/logo.png"
                        alt="EcoGrade"
                        className="relative z-10 w-full h-auto brightness-0 invert opacity-95 drop-shadow-2xl object-contain"
                    />
                </motion.div>

                {/* Slogan - Tipografi geliştirildi (Daha ağır Black ve Daha İnce Light kontrastı) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 mb-4 md:mb-6 tracking-tighter drop-shadow-xl">
                        Küresel Plastik<br className="md:hidden" /> Ticaret Ağı
                    </h1>
                    <p className="text-base md:text-2xl text-textMuted max-w-3xl mx-auto font-light leading-relaxed tracking-wide px-2 md:px-0">
                        Üretim fazlanızı anında <strong className="font-extrabold text-white">likit değere</strong> dönüştürün veya <strong className="font-extrabold text-white">EcoGrade Exper Güvencesiyle</strong> garantili hammadde alın.
                    </p>
                </motion.div>

                {/* Scroll Butonu */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1.5 }}
                    className="mt-10 md:mt-20 flex flex-col items-center"
                >
                    <button
                        onClick={scrollToMarket}
                        className="group flex flex-col items-center gap-4 text-textMuted hover:text-white transition-all duration-500"
                    >
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Piyasayı Keşfet</span>
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/30 transition-all duration-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <ArrowDown size={22} className="relative z-10 group-hover:translate-y-1 transition-transform duration-500" />
                        </div>
                    </button>
                    <div className="mt-12 flex items-center gap-4 text-xs font-bold text-textMuted uppercase tracking-widest opacity-60">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div> Canlı</span>
                        <span>•</span>
                        <span>7 Kıta</span>
                        <span>•</span>
                        <span>Escrow</span>
                    </div>
                </motion.div>
            </div>
        </section >
    );
};

import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const scrollToMarket = () => {
        document.getElementById('market-section').scrollIntoView({ behavior: 'smooth' });
    };

    const [activeTab, setActiveTab] = useState('TÜMÜ');
    const [polymerSearch, setPolymerSearch] = useState('');
    const [selectedPolymers, setSelectedPolymers] = useState([]);
    const [mfiMin, setMfiMin] = useState('');
    const [mfiMax, setMfiMax] = useState('');
    const [experCertified, setExperCertified] = useState(false);
    const [hubReady, setHubReady] = useState(false);
    const [sortConfig, setSortConfig] = useState('Yeniden Eskiye');

    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real data from the backend
        const fetchProducts = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'https://ecograde-broker1.vercel.app';
                const response = await axios.get(`${API_URL}/products/`);
                setApiProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("API'den veri çekilirken hata oluştu:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // API Verisini UI'a uyarlayan yardımcı fonksiyon
    const mapApiDataToUI = (product) => {
        // Gerçek API'deki alanları UI tasarımına eşleme
        let category = "ECOGRADE PRIME";
        let bg = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
        let experScore = product.carbon_score || "A Sınıfı";
        let carbonSavingKg = 0;

        const qtyTons = parseFloat(product.quantity_tons) || 10;

        // Formüller (Karbon Tasarrufu Denklemi):
        // Prime (Virgin) CO2 izi = ~2.5 kg CO2 / kg
        // Recycle (rPP, rPE vb) CO2 izi = ~0.5 kg CO2 / kg (Tasarruf = 2.0 kg/kg = 2000 kg/ton)
        // Off-Grade CO2 izi = ~1.5 kg CO2 / kg (Tasarruf = 1.0 kg/kg = 1000 kg/ton)

        if (product.material_type.includes("Off-Grade") || product.material_type.includes("O.G.")) {
            category = "ECOGRADE OFF";
            bg = "bg-blue-500/10 border-blue-500/20 text-blue-400";
            carbonSavingKg = qtyTons * 1000;
        } else if (product.material_type.includes("Recycle") || product.material_type.includes("PC")) {
            category = "ECOGRADE RECYCLE";
            bg = "bg-purple-500/10 border-purple-500/20 text-purple-400";
            carbonSavingKg = qtyTons * 2000;
        }

        let carbonSaving = carbonSavingKg > 0
            ? `+${carbonSavingKg >= 1000 ? (carbonSavingKg / 1000).toFixed(1) + ' Ton' : carbonSavingKg + ' kg'} CO₂`
            : "Standart Emisyon";

        return {
            id: `LOT-${product.id}`,
            // Orijinal veritabanında "manufacturer" varsa onu, yoksa material_type (MFI ile) göster
            type: product.manufacturer ? `${product.manufacturer} ${product.material_type}` : `${product.material_type} Granül`,
            mfi: `${product.mfi} g/10dk`,
            rawMfi: product.mfi,
            density: `${product.density} g/cm³`,
            color: product.color || "Natural", // DB'de renk yoksa Natural
            packaging: product.packaging || "Big Bag (1 Ton)",
            location: product.location || "EcoGrade Hub TR",
            price: product.selling_price_usd,
            rawPrice: product.selling_price_usd,
            unit: "ton",
            category: category,
            bg: bg,
            experScore: experScore,
            carbonSaving: carbonSaving,
            isExperCertified: experScore.includes('A'), // A ve A+ exper onaylı sayılır
            isHubReady: !product.location || product.location.includes('Hub'), // Hub geçenler veya boş olanlar
            material_type: product.material_type
        };
    };

    // UI formatına çevrilmiş ürünler listesi
    const formattedProducts = apiProducts.map(mapApiDataToUI);

    const handlePolymerToggle = (type) => {
        setSelectedPolymers(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    // Tüm filtrelere göre filtreleme mantığı
    const filteredProducts = formattedProducts.filter(p => {
        // 1. Kategori (Tab)
        if (activeTab !== 'TÜMÜ' && p.category !== activeTab) return false;

        // 2. Polimer Tipi Seçimleri (Kısmı)
        if (selectedPolymers.length > 0) {
            // Tam eşleşme yapıyoruz artık çünkü gerçek verilerin adları.
            const matchesPolymer = selectedPolymers.includes(p.material_type);
            if (!matchesPolymer) return false;
        }

        // 4. MFI Aralığı
        if (mfiMin !== '' && p.rawMfi < parseFloat(mfiMin)) return false;
        if (mfiMax !== '' && p.rawMfi > parseFloat(mfiMax)) return false;

        // 5. Güvence Katmanı
        if (experCertified && !p.isExperCertified) return false;
        if (hubReady && !p.isHubReady) return false;

        return true;
    }).sort((a, b) => {
        if (sortConfig === 'Fiyat (Düşükten Yükseğe)') {
            return (a.rawPrice || 0) - (b.rawPrice || 0);
        }
        if (sortConfig === 'MFI (Yüksekten Düşüğe)') {
            return parseFloat(b.rawMfi) - parseFloat(a.rawMfi);
        }
        // Varsayılan: Yeniden Eskiye (id numarasına göre ters orantı varsayımıyla ID büyüklüğüne göre)
        const idA = parseInt(a.id.split('-')[1]) || 0;
        const idB = parseInt(b.id.split('-')[1]) || 0;
        return idB - idA;
    });

    return (
        <div className="w-full relative bg-background font-sans">

            <HeroSection scrollToMarket={scrollToMarket} />

            {/* =========================================
              MARKETPLACE SECTION (GERÇEK B2B ARABAM.COM STİLİ)
              ========================================= */}
            <section id="market-section" className="min-h-screen bg-surface border-t border-border pt-16 pb-32 relative z-20">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-xl md:text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <Activity className="text-primary" /> Endüstriyel İşlem Tahtası
                            </h2>
                            <p className="text-sm md:text-base text-textMuted">Tüm onaylı üretim fazlaları ve off-grade stoklar.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                            <Link to="/sat" className="btn-secondary h-11 text-sm md:text-base"><Activity size={18} /> Reçine İlanı Ekle</Link>
                            <Link to="/al" className="btn-primary h-11 text-sm md:text-base"><PackageSearch size={18} /> Hızlı Satın Al</Link>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* SOL SİDEBAR FİLTRE (Arabam.com Tarzı) */}
                        <aside className="w-full lg:w-72 flex-shrink-0">
                            <div className="glass-panel p-5 rounded-xl sticky top-28">
                                <div className="flex items-center gap-2 mb-6 text-white font-bold border-b border-white/10 pb-4">
                                    <Filter size={20} /> Detaylı Filtreleme
                                </div>

                                {/* Kategori */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-textMuted uppercase mb-3">Malzeme Sınıfı</h4>
                                    <div className="space-y-2">
                                        {["TÜMÜ", "ECOGRADE PRIME", "ECOGRADE OFF", "ECOGRADE COMP", "ECOGRADE RECYCLE"].map((tab) => (
                                            <label key={tab} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="category_filter"
                                                    checked={activeTab === tab}
                                                    onChange={() => setActiveTab(tab)}
                                                    className="w-4 h-4 bg-transparent border border-white/20 rounded-full checked:bg-primary checked:border-primary appearance-none relative before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white before:scale-0 checked:before:scale-100 before:transition-transform"
                                                />
                                                <span className={`text-sm transition-colors ${activeTab === tab ? 'text-white font-bold' : 'text-textMuted group-hover:text-white'}`}>{tab}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Polimer Tipi */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-textMuted uppercase mb-3">Polimer Tipi</h4>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted/50" size={16} />
                                        <input
                                            type="text"
                                            placeholder="PP, PE, ABS, PA6..."
                                            value={polymerSearch}
                                            onChange={(e) => setPolymerSearch(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-primary transition-colors mb-3"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                                        {[...new Set(apiProducts.map(p => p.material_type))]
                                            .filter(type => type.toLowerCase().includes(polymerSearch.toLowerCase()))
                                            .map(type => (
                                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPolymers.includes(type)}
                                                        onChange={() => handlePolymerToggle(type)}
                                                        className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                                                    />
                                                    <span className="text-sm text-textMuted group-hover:text-white transition-colors">{type}</span>
                                                </label>
                                            ))}
                                    </div>
                                </div>

                                {/* Teknik Değerler: MFI */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-textMuted uppercase mb-3">MFI (Akış İndeksi)</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={mfiMin}
                                            onChange={(e) => setMfiMin(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-textMuted">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={mfiMax}
                                            onChange={(e) => setMfiMax(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>

                                {/* Sertifika ve Güven */}
                                <div>
                                    <h4 className="text-sm font-semibold text-textMuted uppercase mb-3">Güvence Katmanı</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={experCertified}
                                                onChange={(e) => setExperCertified(e.target.checked)}
                                                className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                                            />
                                            <span className="text-sm text-textMuted group-hover:text-white flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /> EcoGrade Exper Onaylı</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={hubReady}
                                                onChange={(e) => setHubReady(e.target.checked)}
                                                className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                                            />
                                            <span className="text-sm text-textMuted group-hover:text-white flex items-center gap-2"><Factory size={14} className="text-blue-400" /> EcoHub Lojistik Hazır</span>
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </aside>

                        {/* SAĞ ÇERÇEVE (Ürün Listesi - Liste Görünümü) */}
                        <div className="flex-1">

                            {/* Aktif Arama / Sıralama */}
                            <div className="flex justify-between items-center mb-4 text-sm">
                                <span className="text-textMuted font-medium"><strong className="text-white">{filteredProducts.length}</strong> lot bulundu</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-textMuted">Sırala:</span>
                                    <select
                                        className="bg-black/30 border border-white/10 rounded-lg py-1 px-3 text-white focus:outline-none"
                                        value={sortConfig}
                                        onChange={(e) => setSortConfig(e.target.value)}
                                    >
                                        <option>Yeniden Eskiye</option>
                                        <option>Fiyat (Düşükten Yükseğe)</option>
                                        <option>MFI (Yüksekten Düşüğe)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Liste Konteyner */}
                            <div className="space-y-4">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-black/20 border border-white/10 rounded-xl hover:border-white/30 hover:bg-black/40 transition-all flex flex-col md:flex-row p-5 gap-6 relative group"
                                    >
                                        {/* ESG ve Statü Rozetleri */}
                                        <div className="absolute top-0 right-0 p-4 flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
                                                <ShieldCheck size={12} /> {product.experScore}
                                            </div>
                                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded flex items-center gap-1">
                                                {product.carbonSaving}
                                            </div>
                                        </div>

                                        {/* Ürün Görsel Placeholder / QR Kod Alanı */}
                                        <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group-hover:border-primary/50 transition-colors">
                                            <PackageSearch size={32} className="text-white/20 mb-2" />
                                            <span className="text-[10px] text-textMuted uppercase tracking-widest">{product.id}</span>
                                            {/* Küçük barkod/qr hissi veren çizgiler */}
                                            <div className="flex gap-[2px] mt-3 h-6 opacity-30">
                                                <div className="w-[3px] bg-white h-full"></div>
                                                <div className="w-[1px] bg-white h-full"></div>
                                                <div className="w-[4px] bg-white h-full"></div>
                                                <div className="w-[2px] bg-white h-full"></div>
                                                <div className="w-[1px] bg-white h-full"></div>
                                                <div className="w-[5px] bg-white h-full"></div>
                                            </div>
                                        </div>

                                        {/* Bilgi Blokları */}
                                        <div className="flex-1 flex flex-col justify-between">

                                            {/* Başlık ve Kategori */}
                                            <div className="mb-4 pr-48"> {/* Rozetler için sağ tarafı boş bırakıyoruz */}
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${product.bg}`}>{product.category}</span>
                                                    <span className="text-xs text-textMuted flex items-center gap-1"><Factory size={12} /> {product.location}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors cursor-pointer">{product.type}</h3>
                                            </div>

                                            {/* Teknik Parametreler Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-lg border border-white/5 mb-4 mt-auto">
                                                <div>
                                                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">MFI Değeri</div>
                                                    <div className="font-mono text-white text-sm font-medium">{product.mfi}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Yoğunluk</div>
                                                    <div className="font-mono text-white text-sm font-medium">{product.density}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Renk</div>
                                                    <div className="text-white text-sm font-medium flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full border border-white/20 ${product.color === 'Natural' ? 'bg-white/90' : product.color === 'Beyaz' ? 'bg-white' : product.color.includes('Siyah') ? 'bg-zinc-800' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}></span>
                                                        {product.color}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Ambalaj</div>
                                                    <div className="text-white text-sm font-medium">{product.packaging}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fiyat ve Aksiyon Bloğu */}
                                        <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                                            <div className="mb-1 text-xs text-textMuted uppercase tracking-wider">Referans Fiyat</div>
                                            <div className="text-2xl font-black text-white mb-4">{formatPrice(product.rawPrice)}<span className="text-sm font-medium text-textMuted">/{product.unit}</span></div>

                                            <button onClick={() => navigate(`/lot/${product.id.replace('LOT-', '')}`)} className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3 px-4 rounded-lg transition-colors flex flex-col items-center justify-center gap-1">
                                                <span className="flex items-center gap-2">Teklif Ver <ChevronRight size={16} /></span>
                                            </button>

                                            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-textMuted font-medium">
                                                <CheckCircle2 size={12} className="text-primary" /> %100 Escrow Güvencesi
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
