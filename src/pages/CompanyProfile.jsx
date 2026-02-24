import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Globe, Mail, Phone, ExternalLink, Leaf, Award, TrendingUp, CheckCircle2, ChevronRight, Hash } from 'lucide-react';

const CompanyProfile = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);

    // Mock data fetching based on ID
    useEffect(() => {
        let isMounted = true;

        // Simulate API delay
        const timer = setTimeout(() => {
            if (!isMounted) return;

            // Mock Portföy
            let activeLots = [
                { id: 'TX-8921', polimer: 'Recycle PET Flake', mfi: 32, qty: 120, price: 720 }, // Recycle
                { id: 'TX-7734', polimer: 'Off-Grade HDPE', mfi: 0.8, qty: 65, price: 1080 }, // Off-grade
                { id: 'TX-3291', polimer: 'PP-H Prime', mfi: 12.5, qty: 25, price: 1240 }, // Prime
            ];

            // MATEMATİKSEL DENKLEM (Karbon Tasarrufu Hesaplama)
            // ----------------------------------------------------
            // Recycle (Geri Dönüşüm) = ~2000 kg CO2 / ton tasarruf (Virgin'e kıyasla)
            // Off-Grade = ~1000 kg CO2 / ton tasarruf
            let carbonSavedKg = 0;

            activeLots.forEach(lot => {
                if (lot.polimer.includes('Recycle')) {
                    carbonSavedKg += lot.qty * 2000;
                } else if (lot.polimer.includes('Off-Grade')) {
                    carbonSavedKg += lot.qty * 1000;
                }
            });

            // DENKLEM (ESG Skoru Hesaplama)
            // ----------------------------------------------------
            // Baz Skoru = 60
            // Her 10 Ton (10,000 kg) Karbon Tasarrufunda +1 Skor Puanı Eklenir. Maks: 99
            let calculatedEsgScore = Math.min(99, Math.round(60 + (carbonSavedKg / 10000)));

            setCompany({
                id: id || 'comp_9238',
                name: 'Bosphorus Plastics A.Ş.',
                type: 'Üretici / Geri Dönüşüm Tesisi',
                joinedAt: 'Mart 2024',
                location: 'GEBKİM, Kocaeli, TR',
                website: 'www.bosphorusplastics.com',
                description: 'Endüstriyel atıklardan yüksek kalite regranülasyon ve off-grade prime hammadde satışında uzmanlaşmış yenilikçi tesis. Sistemde izlenen karbon ayak izi algoritmaları bağımsız laboratuvar parametreleriyle oranlanarak şeffaf biçimde sergilenmektedir.',
                metrics: {
                    completedTrades: 124,
                    totalVolume: '2,400 Ton',
                    successRate: '%98',
                    responseRate: '< 2 Saat'
                },
                verification: {
                    status: 'GOLD',
                    esgScore: calculatedEsgScore,
                    co2Saved: `${(carbonSavedKg / 1000).toFixed(1)} Ton`,
                    labAudited: true
                },
                activeLots: activeLots
            });
        }, 600);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [id]);

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-textMuted font-mono">Firma profili yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/al" className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors mb-6">
                <ChevronRight size={14} className="rotate-180" /> Pazara Dön
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-2xl border border-white/10 p-6 relative overflow-hidden"
                    >
                        {/* Status glow */}
                        {company.verification.status === 'GOLD' && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none"></div>
                        )}

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0">
                                <Building2 size={28} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white leading-tight">{company.name}</h1>
                                <p className="text-sm text-textMuted mt-1">{company.type}</p>
                            </div>
                        </div>

                        {company.verification.status === 'GOLD' && (
                            <div className="mb-6 flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-500 border border-amber-500/20 px-3 py-2 rounded-lg font-bold text-sm">
                                <Award size={18} /> Verified Gold Seller
                            </div>
                        )}

                        <div className="space-y-4 text-sm mb-6 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-3 text-textMuted">
                                <MapPin size={16} className="text-white/40" /> {company.location}
                            </div>
                            <div className="flex items-center gap-3 text-textMuted">
                                <Globe size={16} className="text-white/40" />
                                <a href="#" className="hover:text-primary transition-colors underline underline-offset-2">{company.website}</a>
                            </div>
                            <div className="flex items-center gap-3 text-textMuted">
                                <ShieldCheck size={16} className="text-white/40" /> Temsilci Onayı: {company.joinedAt}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white">İletişim</h3>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">Mesaj Gönder</span>
                                </div>
                                <ChevronRight size={16} className="text-textMuted" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-white/5">
                                <div className="flex items-center gap-3 text-textMuted">
                                    <Phone size={16} /> <span className="text-sm">Gizli Numara</span>
                                </div>
                                <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/50">Yetki Gerekli</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Metrics Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel rounded-2xl border border-white/10 p-6"
                    >
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp size={16} className="text-primary" /> Performans Verileri
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0F172A]/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{company.metrics.completedTrades}</div>
                                <div className="text-xs text-textMuted mt-1">Başarılı İşlem</div>
                            </div>
                            <div className="bg-[#0F172A]/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-400">{company.metrics.totalVolume}</div>
                                <div className="text-xs text-textMuted mt-1">İşlem Hacmi</div>
                            </div>
                            <div className="bg-[#0F172A]/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{company.metrics.successRate}</div>
                                <div className="text-xs text-textMuted mt-1">Memnuniyet</div>
                            </div>
                            <div className="bg-[#0F172A]/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-lg font-bold text-white">{company.metrics.responseRate}</div>
                                <div className="text-xs text-textMuted mt-1">Yanıt Süresi</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Details & Lots */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8"
                    >
                        <h2 className="text-lg font-bold text-white mb-4">Firma Hakkında</h2>
                        <p className="text-textMuted leading-relaxed">{company.description}</p>
                    </motion.div>

                    {/* ESG & Sustainability */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Leaf size={20} className="text-emerald-400" /> Sürdürülebilirlik & ESG
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-textMuted">EcoGrade ESG Skoru</span>
                                    <span className="text-xl font-bold text-emerald-400">{company.verification.esgScore}/100</span>
                                </div>
                                <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${company.verification.esgScore}%` }}></div>
                                </div>
                                <p className="text-xs text-textMuted mt-4 leading-relaxed tracking-wide">Üreticinin karbon emisyon tasarrufu doğrudan matematiksel analize dayanır. <br /><br /><strong className="text-emerald-500/80">Algoritmik Model:</strong> Baz Puan(60) + [Σ (Q_rec × 2.0 + Q_off × 1.0) / 10]</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3">
                                        <Leaf size={16} className="text-emerald-400" />
                                        <span className="text-sm font-bold text-white">Toplam CO₂ Tasarrufu</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-emerald-400">{company.verification.co2Saved}</span>
                                        <div className="text-[10px] text-emerald-500/50 mt-1 uppercase tracking-widest font-mono">Σ(Miktar × Emisyon Çarpanı)</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-white/5">
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle2 size={16} className="text-primary" />
                                        <span className="text-sm font-medium">Bağımsız Lab Denetimi</span>
                                    </div>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">ONAYLI</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Active Lots */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4 mt-2">
                            <h2 className="text-lg font-bold text-white">Yayındaki Lotları ({company.activeLots.length})</h2>
                            <Link to="/al" className="text-sm text-primary hover:underline">Tümünü İncele</Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {company.activeLots.map((lot, idx) => (
                                <Link
                                    to={`/lot/${lot.id}`}
                                    key={idx}
                                    className="bg-surface border border-border hover:border-primary/50 rounded-xl p-4 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-[#0F172A] flex items-center justify-center font-bold text-xs border border-white/5">
                                                {lot.polimer}
                                            </div>
                                            <span className="text-xs text-textMuted font-mono"><Hash size={10} className="inline" />{lot.id}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-textMuted">MFI:</span>
                                            <span className="text-white font-medium">{lot.mfi}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-textMuted">Miktar:</span>
                                            <span className="text-white font-medium">{lot.qty} Ton</span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-base font-bold text-white">${lot.price}<span className="text-xs text-textMuted font-normal">/ton</span></span>
                                        <ChevronRight size={16} className="text-textMuted group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
