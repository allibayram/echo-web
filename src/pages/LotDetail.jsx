import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Download, FileText, CheckCircle2, ChevronRight, Hash, Building2, MapPin, Microscope, Leaf, MessageSquareText, Star } from 'lucide-react';
import ChatDrawer from '../components/ChatDrawer';

const LotDetail = () => {
    const { id } = useParams();
    const [lot, setLot] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        // Mock fetch based on TxID
        setTimeout(() => {
            setLot({
                id: id || 'TX-892155X',
                polimer: 'PP-H (Polipropilen Homopolimer)',
                grade: 'Off-Grade / Endüstriyel Sınıf',
                mfi: '12.4 g/10min',
                density: '0.905 g/cm³',
                qty: 25,
                price: 1150,
                location: 'GEBKİM, Kocaeli Deposunda',
                color: 'Doğal (Hafif sararma mevcut)',
                packaging: '1000 kg Big Bags',
                seller: {
                    id: 'comp_9238',
                    name: 'Bosphorus Plastics A.Ş.',
                    verified: true
                },
                labResults: {
                    date: '15 Mart 2024',
                    inspector: 'Ahmet T. (EcoGrade Senior Exper)',
                    ashContent: '%0.02',
                    moisture: '%0.01',
                    tensileStrength: '32 MPa'
                },
                images: [
                    'https://images.unsplash.com/photo-1605553556041-76c245b7f75b?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1590494056294-84c47bb41315?auto=format&fit=crop&q=80'
                ]
            });
        }, 500);
    }, [id]);

    const handleDownloadPDF = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            // Simulate download by opening a dummy blob or just an alert
            alert("TDS & Kalite Raporu bilgisayarınıza indirildi.");
        }, 1500);
    };

    if (!lot) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-textMuted font-mono">Blockchain kayıtları getiriliyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
            <Link to="/al" className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors mb-6">
                <ArrowLeft size={16} /> Borsa Ekranına Dön
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf: Görseller & Başlık */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                                    <ShieldCheck size={12} /> EXPER ONAYLI
                                </span>
                                <span className="text-xs text-textMuted font-mono">Lot Ref: {lot.id}</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white">{lot.polimer}</h1>
                            <p className="text-lg text-textMuted mt-1">{lot.grade}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0F172A] aspect-video">
                            <img src={lot.images[0]} alt="Lot image" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0F172A] aspect-video">
                            <img src={lot.images[1]} alt="Lot image details" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 mt-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Microscope size={20} className="text-primary" /> Laboratuvar & Teknik Analiz
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-[#0B1120] border border-white/5 p-4 rounded-xl">
                                <span className="text-xs text-textMuted block mb-1">Erime Akış (MFI)</span>
                                <span className="text-base font-bold text-white">{lot.mfi}</span>
                            </div>
                            <div className="bg-[#0B1120] border border-white/5 p-4 rounded-xl">
                                <span className="text-xs text-textMuted block mb-1">Yoğunluk</span>
                                <span className="text-base font-bold text-white">{lot.density}</span>
                            </div>
                            <div className="bg-[#0B1120] border border-white/5 p-4 rounded-xl">
                                <span className="text-xs text-textMuted block mb-1">Kül Oranı (Ash)</span>
                                <span className="text-base font-bold text-white">{lot.labResults.ashContent}</span>
                            </div>
                            <div className="bg-[#0B1120] border border-white/5 p-4 rounded-xl">
                                <span className="text-xs text-textMuted block mb-1">Nem Sürtünme</span>
                                <span className="text-base font-bold text-white">{lot.labResults.moisture}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <FileText size={16} className="text-primary" /> Kapsamlı TDS / Analiz Raporu
                                </h4>
                                <p className="text-xs text-textMuted mt-1">Denetçi: {lot.labResults.inspector} | Tarih: {lot.labResults.date}</p>
                            </div>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isDownloading ? (
                                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> <span>İniyor...</span></>
                                ) : (
                                    <><Download size={16} /> PDF Raporunu İndir</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: Fiyat, Satıcı ve Aksiyon */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Price Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none"></div>

                        <div className="mb-6 pb-6 border-b border-white/5">
                            <span className="text-textMuted text-sm font-medium uppercase tracking-wider block mb-2">Escrow Teminat Fiyatı</span>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-white">${lot.price}</span>
                                <span className="text-textMuted mb-1 font-mono">/ Ton</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <span className="text-white font-medium">Toplam Miktar:</span>
                                <span className="text-primary font-bold">{lot.qty} Ton</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm bg-[#0B1120] p-3 rounded-lg border border-white/5">
                                <span className="text-textMuted">Toplam İşlem Bedeli:</span>
                                <span className="text-white font-bold">${(lot.price * lot.qty).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <MapPin size={16} className="text-white/40" /> {lot.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <Building2 size={16} className="text-white/40" /> {lot.packaging}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <Leaf size={16} className="text-emerald-400" /> ~%70 Karbon Ayak İzi Tasarrufu
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-4 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                                <ShieldCheck size={20} /> Güvenli Escrow'a Al
                            </button>
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="w-full py-3 md:py-4 bg-[#0F172A] border border-white/10 hover:border-primary/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquareText size={18} className="text-primary" /> Satıcı ile Pazarlık Başlat
                            </button>
                        </div>
                    </div>

                    {/* Seller Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <span className="text-xs text-textMuted uppercase tracking-wider block mb-4">Satıcı Tesis Bilgileri</span>

                        <div className="flex items-center justify-between mb-4">
                            <div className="font-bold text-white flex items-center gap-2">
                                {lot.seller.name}
                                {lot.seller.verified && <CheckCircle2 size={16} className="text-emerald-500" />}
                            </div>
                        </div>

                        {/* RATING MODULE */}
                        <div className="flex items-center gap-2 mb-5 cursor-pointer group" onClick={() => setShowReviews(!showReviews)}>
                            <div className="flex text-amber-400">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" className="opacity-30" />
                            </div>
                            <span className="text-white font-bold text-sm group-hover:text-primary transition-colors">4.8</span>
                            <span className="text-textMuted text-xs underline decoration-white/20 group-hover:decoration-primary/50 transition-colors">(124 Değerlendirme)</span>
                        </div>

                        {/* Reviews Dropdown */}
                        <AnimatePresence>
                            {showReviews && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 overflow-hidden"
                                >
                                    <div className="bg-[#0B1120] border border-white/5 rounded-xl p-4 space-y-4">
                                        <h4 className="text-[10px] text-textMuted uppercase tracking-wider font-bold mb-2 flex justify-between items-center">
                                            <span>Son B2B İşlemleri</span>
                                            <span className="text-emerald-500">%94 Pozitif</span>
                                        </h4>
                                        {[
                                            { comp: "M*** Plastik", star: 5, text: "Kesinlikle tavsiye ederim, MFI değerleri laboratuvar sonuçlarıyla birebir tutuyor.", date: "2 gün önce" },
                                            { comp: "E*** Geri Dönüşüm", star: 4, text: "İletişimleri çok hızlı, ancak lojistik firması kaynaklı 1 gün gecikme oldu.", date: "1 hafta önce" },
                                            { comp: "A*** Ambalaj", star: 5, text: "Sorunsuz ticaret. Malzeme kalitesi beklediğimizden iyiydi.", date: "3 hafta önce" }
                                        ].map((rev, i) => (
                                            <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-white text-[11px] font-bold">{rev.comp}</span>
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, idx) => <Star key={idx} size={10} fill={idx < rev.star ? "currentColor" : "none"} className={idx >= rev.star ? "text-gray-600" : ""} />)}
                                                    </div>
                                                </div>
                                                <p className="text-textMuted text-[10px] italic">"{rev.text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link
                            to={`/company/${lot.seller.id}`}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Building2 size={16} /> Firma Profilini İncele <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* QR Area */}
                    <div className="bg-[#0B1120] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-20 h-20 bg-white p-2 rounded">
                            {/* SVG mockup for a QR Code */}
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#0B1120" d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM50 20h20v10H50zM40 40h10v20H40zM60 40h40v10H60zM70 80h30v20H70zM40 70h20v30H40zM80 60h10v10H80z" />
                                <rect width="10" height="10" x="20" y="40" fill="#0B1120" />
                                <rect width="10" height="10" x="10" y="50" fill="#0B1120" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-white block">EcoGrade Blockchain QR</span>
                            <span className="text-xs text-textMuted">Tüm test süreçleri blockchain üzerindedir. QR'ı okutun.</span>
                        </div>
                    </div>
                </div>
            </div>

            <ChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                lotData={lot}
                sellerName={lot.seller.name}
            />
        </div>
    );
};

export default LotDetail;
