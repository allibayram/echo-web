import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Box, Search, ArrowRight, Sparkles, Factory, TrendingUp, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromoVideo() {
    const [scene, setScene] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // Sonsuz Döngü (Infinite Loop) - Her sahne 8 saniye
        const totalScenes = 6;
        const interval = setInterval(() => {
            setScene(prev => (prev >= totalScenes ? 1 : prev + 1));
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const Particles = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full blur-[1px]"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 2 + 0.5,
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                    animate={{
                        y: [null, Math.random() * -500 - 100],
                        opacity: [null, 0],
                        scale: [null, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center overflow-hidden font-sans text-white perspective-[2000px]">
            <div className="absolute top-0 left-0 w-full h-[8vh] bg-black z-50 shadow-[0_15px_30px_rgba(0,0,0,0.9)] flex items-center px-12 justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-primary" />
                    <span className="font-black text-xl tracking-widest uppercase">EcoGrade</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs text-emerald-500/80 tracking-widest">SYSTEM ONLINE</span>
                </div>
            </div>

            {/* Alt Bilgi Çubuğu */}
            <div className="absolute bottom-0 left-0 w-full h-[8vh] bg-black z-50 shadow-[0_-15px_30px_rgba(0,0,0,0.9)] flex items-center justify-between px-12">
                <p className="text-white/20 text-xs font-mono tracking-[0.3em]">B2B TERMINAL VISUALIZATION LOOP</p>
                <p className="text-white/20 text-xs font-mono tracking-widest uppercase">Sahne {scene}/6</p>
            </div>

            {/* Arka Plan Radyantı */}
            <motion.div
                className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,rgba(0,0,0,0)_70%)]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <Particles />

            {/* Sabit ve Dikkat Çekici "Platforma Gir" Butonu */}
            <div className="absolute top-1/2 right-4 md:right-16 -translate-y-1/2 z-[300] flex flex-col items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="group relative inline-flex items-center justify-center bg-white text-black font-extrabold tracking-widest uppercase text-xl px-12 py-6 rounded-full overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] z-[301] shadow-[0_0_20px_rgba(255,255,255,0.3)] shadow-black/20"
                >
                    <div className="absolute inset-0 w-0 bg-primary transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                    <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300 flex items-center gap-3">
                        Terminale Gir <ArrowRight size={24} />
                    </span>
                </button>
                <p className="text-white/60 text-sm font-light z-[300] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Animasyonu beklemenize gerek yok</p>
            </div>

            {/* Dönen Animasyonlar */}
            <AnimatePresence mode="wait">
                {scene === 1 && (
                    <motion.div
                        key="scene1"
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-center z-10 flex flex-col items-center pr-64"
                    >
                        <motion.h1
                            animate={{ textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 40px rgba(255,255,255,0.8)", "0px 0px 0px rgba(255,255,255,0)"] }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            className="text-7xl md:text-9xl font-black tracking-tighter mb-6 text-white"
                        >
                            İlan Çöplüğüne <span className="text-red-500">Son.</span>
                        </motion.h1>
                        <p className="text-3xl text-textMuted font-light tracking-wide max-w-3xl leading-relaxed">
                            B2B plastik ticareti hiç bu kadar <strong className="text-white">veri odaklı</strong> olmamıştı.
                        </p>
                    </motion.div>
                )}

                {scene === 2 && (
                    <motion.div
                        key="scene2"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="z-10 w-full max-w-6xl px-12 pr-64"
                    >
                        <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-3xl p-12 overflow-hidden relative backdrop-blur-md">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>

                            <div className="space-y-8 relative z-10 w-5/12">
                                <motion.div animate={{ opacity: [1, 0.5, 1], x: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-red-400 text-2xl font-mono decoration-line-through border-l-4 border-red-500 pl-6">Manuel Pazarlıklar</motion.div>
                                <motion.div animate={{ opacity: [1, 0.5, 1], x: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="text-red-400 text-2xl font-mono decoration-line-through border-l-4 border-red-500 pl-6">Riskli Tahsilatlar</motion.div>
                            </div>

                            <ArrowRight size={64} className="text-white/20 mx-8" />

                            <div className="space-y-6 relative z-10 w-7/12">
                                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-primary/10 border border-primary/30 p-6 rounded-2xl flex items-center gap-6">
                                    <Globe size={40} className="text-primary" />
                                    <div>
                                        <div className="text-sm text-primary font-bold uppercase tracking-widest mb-1">Milisaniye Hızında</div>
                                        <div className="text-3xl font-black">ICIS & Platts Entegrasyonu</div>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-accent/10 border border-accent/30 p-6 rounded-2xl flex items-center gap-6">
                                    <ShieldCheck size={40} className="text-accent" />
                                    <div>
                                        <div className="text-sm text-accent font-bold uppercase tracking-widest mb-1">Garanti Altında</div>
                                        <div className="text-3xl font-black">%100 Kurumsal Escrow</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ opacity: 0, scale: 1.5, filter: "blur(40px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -100, scale: 0.8 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center z-10 pr-64"
                    >
                        <div className="relative inline-block mb-10">
                            <motion.div
                                className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="w-40 h-40 bg-[#0a2e1d] border-2 border-primary rounded-[3rem] flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(16,185,129,0.4)] rotate-3">
                                <Sparkles size={80} className="text-primary" />
                            </div>
                        </div>
                        <h1 className="text-8xl font-black mb-6 tracking-tighter">EcoGrade Broker</h1>
                        <p className="text-3xl text-primary font-bold tracking-[0.4em] uppercase bg-black/50 px-8 py-3 rounded-full inline-block border border-primary/20">B2B Terminal</p>
                    </motion.div>
                )}

                {scene === 4 && (
                    <motion.div
                        key="scene4"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 1 }}
                        className="z-10 w-full max-w-5xl px-8 pr-64"
                    >
                        <div className="glass-panel p-12 border border-white/20 relative overflow-hidden bg-black/60 shadow-2xl rounded-3xl">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h3 className="text-4xl font-black text-white flex items-center gap-4">
                                        <Cpu size={40} className="text-primary" /> AI Fiyatlama Motoru
                                    </h3>
                                    <p className="text-textMuted font-mono mt-2 text-sm tracking-widest">SCANNING GLOBAL INDICES...</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-textMuted uppercase tracking-widest mb-1">Analiz Edilen Örnek</div>
                                    <div className="font-bold flex items-center gap-2 text-xl"><Factory size={20} /> Prime Sasa PET</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-12">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                                    <motion.div className="absolute inset-0 bg-primary/10" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                                    <span className="text-sm text-primary uppercase font-bold tracking-widest mb-2 relative z-10">MFI</span>
                                    <span className="text-4xl font-black text-white relative z-10">35.0</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                                    <motion.div className="absolute inset-0 bg-primary/10" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }} />
                                    <span className="text-sm text-primary uppercase font-bold tracking-widest mb-2 relative z-10">Yoğunluk</span>
                                    <span className="text-4xl font-black text-white relative z-10">1.350</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                                    <span className="text-sm text-textMuted uppercase tracking-widest mb-2">Hacim</span>
                                    <span className="text-4xl font-black text-white">250 Ton</span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-gradient-to-r from-primary/20 to-emerald-900/40 border border-primary p-8 rounded-2xl flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <p className="text-sm text-emerald-400 uppercase font-black tracking-widest">Garantili Alım Onaylandı</p>
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <p className="text-6xl font-black text-white tracking-tighter">$1,280</p>
                                        <p className="text-xl text-textMuted font-medium uppercase tracking-widest">/ Ton</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {scene === 5 && (
                    <motion.div
                        key="scene5"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="z-10 w-full max-w-6xl px-12 pr-64"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-6xl font-black mb-6">Sertifikalı Tedarik Havuzu</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="bg-[#0f1115] border border-white/5 p-10 rounded-3xl opacity-60 filter grayscale-[50%] flex flex-col justify-center">
                                <span className="bg-primary/10 text-primary self-start text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-6">Standart Fiyat Listesi</span>
                                <h4 className="text-4xl font-bold mb-6">Petkim HDPE</h4>
                                <p className="text-4xl font-black text-white">$1,100 <span className="text-xl text-textMuted font-normal">/ Ton</span></p>
                            </div>

                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-gradient-to-br from-[#1a1205] to-[#2a1b05] border-[3px] border-amber-500/80 p-10 rounded-3xl relative shadow-[0_0_80px_rgba(245,158,11,0.2)] transform hover:scale-105"
                            >
                                <div className="absolute -top-6 left-10 bg-amber-500 text-black font-black text-base px-8 py-3 rounded-xl flex items-center gap-3 shadow-xl shadow-amber-500/30">
                                    <Activity size={24} /> HAREKETSİZ STOK FIRSATI
                                </div>
                                <h4 className="text-5xl font-black mb-6 text-white mt-6">OFSAS Off-Grade PP</h4>
                                <div className="flex flex-col relative z-10 mt-8">
                                    <span className="text-2xl text-white/40 line-through decoration-red-500 font-medium mb-3 inline-block">Liste: $1,250 / Ton</span>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-7xl font-black text-amber-400 drop-shadow-md">$1,125</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {scene === 6 && (
                    <motion.div
                        key="scene6"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ duration: 1 }}
                        className="z-10 w-full px-16 flex flex-col items-center pr-64"
                    >
                        <div className="w-full max-w-5xl glass-panel border border-white/10 rounded-3xl p-2 bg-gradient-to-b from-white/10 to-transparent">
                            <div className="bg-black/80 rounded-[1.4rem] p-12 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30"><Activity size={32} className="text-primary" /></div>
                                        <div>
                                            <h3 className="text-3xl font-black">Görev Kontrol Merkezi</h3>
                                            <p className="text-primary text-base font-mono tracking-widest uppercase mt-1">Global Broker Hub</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    {[
                                        { title: "Aktif Eşleşme", val: "24", col: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                                        { title: "Garantili Alım", val: "12", col: "text-primary", bg: "bg-primary/20", border: "border-primary/50" }
                                    ].map((m, i) => (
                                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + (i * 0.1) }} key={i} className={`${m.bg} border ${m.border} p-8 rounded-3xl flex flex-col justify-between`}>
                                            <p className="text-base text-white/60 uppercase font-black tracking-widest mb-6">{m.title}</p>
                                            <p className={`text-6xl font-black ${m.col}`}>{m.val}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* İlerleme Çubuğu İzleği */}
            <div className="absolute top-[8vh] left-0 h-[2px] bg-white/10 w-full z-50">
                <motion.div
                    key={scene}
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                />
            </div>
        </div>
    );
}
