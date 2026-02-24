import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, Zap, Factory, CheckCircle2, CircleDashed, Activity } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const BuyWorkflow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        material_type: 'PP',
        min_mfi: '',
        max_mfi: '',
        min_density: '',
        max_density: '',
        target_quantity_tons: ''
    });

    const [reqId, setReqId] = useState(null);
    const [matches, setMatches] = useState([]);
    const [checkoutLot, setCheckoutLot] = useState(null);

    const handleSearch = async (e, showAll = false) => {
        if (e) e.preventDefault();
        setLoading(true);

        setTimeout(async () => {
            try {
                if (showAll) {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                    const res = await axios.get(`${API_URL}/products/`, { timeout: 3000 });
                    setMatches(res.data);
                } else {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                    const matchRes = await axios.post(`${API_URL}/products/match`, {
                        material_type: formData.material_type,
                        min_mfi: parseFloat(formData.min_mfi),
                        max_mfi: parseFloat(formData.max_mfi),
                        min_density: parseFloat(formData.min_density),
                        max_density: parseFloat(formData.max_density),
                        target_quantity_tons: parseFloat(formData.target_quantity_tons) || 1
                    }, { timeout: 3000 });
                    setMatches(matchRes.data);
                }
                setStep(2);
                setLoading(false);
            } catch (err) {
                console.error("API Error: Fallback data used", err);
                // Fallback mock verileri yüklüyoruz ki deneyim bölünmesin
                const fallbackLots = [
                    { id: 'FB-192', material_type: formData.material_type || 'PP', quantity_tons: 24, mfi: 12.5, density: 0.95, selling_price_usd: 1250, has_idle_alert: true, suggested_discount_usd: 50 },
                    { id: 'FB-993', material_type: formData.material_type || 'PP', quantity_tons: 15, mfi: 8.0, density: 0.92, selling_price_usd: 1100, has_idle_alert: false }
                ];
                setMatches(fallbackLots);
                setStep(2);
                setLoading(false);
            }
        }, 1500);
    };

    const handleCheckout = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            await axios.post(`${API_URL}/checkout/`, {
                lot_id: checkoutLot.id,
                quantity_tons: checkoutLot.quantity_tons,
                incoterms: 'EXW'
            });
            setStep(4);
        } catch (err) {
            alert('Ödeme sırasında hata oluştu');
        }
    };

    // YATAY GEÇİŞ ANİMASYONU İÇİN VARİANTLAR
    const slideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
    };

    const steps = [
        { num: 1, label: "Talep & Tarama" },
        { num: 2, label: "Stok Eşleştirme" },
        { num: 3, label: "Escrow Güvencesi" },
        { num: 4, label: "Exper Doğrulaması" }
    ];

    return (
        <div className="w-full min-h-[85vh] bg-background flex flex-col relative text-textMain font-sans overflow-hidden">
            {/* ŞIK PROGRESS BAR (STEPPER) */}
            <div className="w-full border-b border-border bg-surface/30 backdrop-blur-xl sticky top-20 z-40">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between relative">
                    {/* Bağlantı Çizgisi */}
                    <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-white/5 z-0"></div>

                    {steps.map((s, i) => {
                        const isActive = step === s.num;
                        const isPast = step > s.num;
                        return (
                            <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-xl ${isActive ? 'bg-primary text-background scale-110 shadow-primary/30' : isPast ? 'bg-white/20 text-white' : 'bg-surface border border-white/10 text-textMuted'}`}>
                                    {isPast ? <CheckCircle2 size={18} /> : s.num}
                                </div>
                                <span className={`text-xs font-semibold uppercase tracking-widest ${isActive ? 'text-primary' : isPast ? 'text-white' : 'text-textMuted'}`}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                {step < 4 && (
                    <button onClick={() => navigate('/')} className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-textMuted hover:text-white transition-colors mb-10 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Ana Ekrana Dön
                    </button>
                )}

                <div className="relative w-full">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: TALEP FORMU */}
                        {step === 1 && !loading && (
                            <motion.div key="form" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Garantili Hammadde Bul</h2>
                                    <p className="text-textMuted text-lg max-w-2xl mx-auto leading-relaxed">Riskli ilanlara güvenmeyin. Spekleri girin, <strong className="text-white">EcoGrade Exper Kontrollü Veri Tabanı</strong> üzerinden TDS garantili sipariş verin.</p>
                                </div>

                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div>
                                        <label className="form-label">Aradığınız Polimer Tipi</label>
                                        <select
                                            className="input-field max-w-sm"
                                            value={formData.material_type}
                                            onChange={e => setFormData({ ...formData, material_type: e.target.value })}
                                        >
                                            <option value="PP" className="bg-surface text-white">PP - Polipropilen</option>
                                            <option value="PE" className="bg-surface text-white">PE - Polietilen</option>
                                            <option value="PVC" className="bg-surface text-white">PVC</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-white/5 bg-black/20 rounded-xl">
                                        <div>
                                            <label className="form-label text-white/70">MFI (g/10dk) Aralığı</label>
                                            <div className="flex items-center gap-4">
                                                <input type="number" step="0.01" required placeholder="Min" className="input-field" value={formData.min_mfi} onChange={e => setFormData({ ...formData, min_mfi: e.target.value })} />
                                                <span className="text-textMuted">-</span>
                                                <input type="number" step="0.01" required placeholder="Max" className="input-field" value={formData.max_mfi} onChange={e => setFormData({ ...formData, max_mfi: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label text-white/70">Yoğunluk (g/cm³) Aralığı</label>
                                            <div className="flex items-center gap-4">
                                                <input type="number" step="0.001" required placeholder="Min" className="input-field" value={formData.min_density} onChange={e => setFormData({ ...formData, min_density: e.target.value })} />
                                                <span className="text-textMuted">-</span>
                                                <input type="number" step="0.001" required placeholder="Max" className="input-field" value={formData.max_density} onChange={e => setFormData({ ...formData, max_density: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Gereken Tonaj (Min)</label>
                                        <input
                                            type="number" required placeholder="Örn: 24"
                                            className="input-field max-w-sm"
                                            value={formData.target_quantity_tons} onChange={e => setFormData({ ...formData, target_quantity_tons: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                        <button type="submit" className="btn-accent flex-1 text-lg py-5 group">
                                            <Zap size={20} className="group-hover:animate-pulse" />
                                            Sertifikalı Veri Tabanında Tara
                                        </button>
                                        <button type="button" onClick={() => handleSearch(null, true)} className="btn-secondary flex-1 text-lg py-5 flex items-center justify-center gap-2">
                                            Tüm Katalog Stoklarını Gör
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* LOADING */}
                        {loading && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 flex flex-col items-center justify-center text-center w-full">
                                <div className="w-24 h-24 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">Tedarik Ağı Taranıyor</h3>
                                <p className="text-textMuted text-lg max-w-md">Talebinize (TDS değerlerine) birebir uyan, testten geçmiş lotlar eşleştiriliyor...</p>
                            </motion.div>
                        )}

                        {/* STEP 2: SONUÇLAR */}
                        {step === 2 && (
                            <motion.div key="results" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                                    <div>
                                        <h2 className="text-4xl font-black text-white tracking-tighter">Eşleşen Stoklar</h2>
                                        <p className="text-textMuted mt-2">Laboratuvar onaylı ve teslime hazır malzemeler</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                        <CheckCircle2 size={18} /> {matches.length} Lot Bulundu
                                    </div>
                                </div>

                                {matches.length === 0 ? (
                                    <div className="bg-surface/50 border border-border p-8 rounded-2xl text-center max-w-2xl mx-auto">
                                        <p className="font-bold text-xl text-white">Bu kriterlere uygun onaylı stok şu an depoda bulunmuyor.</p>
                                        <p className="text-base text-textMuted mt-3 mb-8">Talebinizi "Açık Emir" olarak kaydetmek ve ürün geldiğinde ilk size haber verilmesi için iletişim bilgilerinizi bırakın.</p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input type="email" placeholder="Kurumsal E-Posta Adresi" className="input-field flex-1" />
                                            <button onClick={() => alert("Talebiniz kaydedildi! Malzemeler depoya indiği an bilgilendirileceksiniz.")} className="btn-primary shrink-0">Bana Haber Ver (Açık Emir)</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {matches.map(lot => (
                                            <div key={lot.id} className={`bg-surface border transition-colors p-6 rounded-2xl flex flex-col h-full group ${lot.has_idle_alert ? 'border-amber-500/50 hover:border-amber-500' : 'border-white/10 hover:border-accent/40'}`}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                                                <ShieldCheck size={14} /> EcoGrade Onaylı
                                                            </span>
                                                            {lot.has_idle_alert && (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider animate-pulse flex-shrink-0">
                                                                    <Activity size={14} /> Hareketsiz Stok Fırsatı (-%10)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-2xl font-black text-white">{lot.material_type} <span className="text-textMuted font-medium text-lg ml-2">{lot.quantity_tons} Ton</span></h3>
                                                        <p className="text-sm text-textMuted mt-1">Lot No #{lot.id}</p>
                                                    </div>
                                                </div>

                                                <div className={`grid grid-cols-2 gap-4 mb-4 ${lot.has_idle_alert ? 'bg-amber-950/20 border border-amber-900/30' : 'bg-black/40'} p-4 rounded-xl flex-1`}>
                                                    <div>
                                                        <p className="text-xs text-textMuted uppercase tracking-wider mb-1">MFI</p>
                                                        <p className="text-lg font-semibold text-white">{lot.mfi}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Yoğunluk</p>
                                                        <p className="text-lg font-semibold text-white">{lot.density}</p>
                                                    </div>
                                                </div>

                                                {lot.has_idle_alert && lot.suggested_discount_usd && (
                                                    <div className="mb-4 text-sm text-amber-400/90 flex gap-2 items-start">
                                                        <ShieldCheck size={16} className="mt-0.5" />
                                                        <p>Bu ürün EcoGrade havuzunda serbest stok konumundadır. Akıllı Fiyat Motorumuz size ekstra indirim müzakeresi sunuyor.</p>
                                                    </div>
                                                )}

                                                <div className="flex items-end justify-between mt-auto">
                                                    <div>
                                                        <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Teslim Fiyatı</p>
                                                        <div className="text-3xl font-bold text-accent">
                                                            ${lot.selling_price_usd}
                                                            <span className="text-base font-normal text-textMuted">/Ton</span>
                                                        </div>
                                                        {lot.has_idle_alert && lot.suggested_discount_usd && (
                                                            <div className="text-amber-500 font-medium text-sm mt-1 line-through opacity-70">
                                                                Eski Fiyat: ${(lot.selling_price_usd + lot.suggested_discount_usd).toFixed(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                        <Link
                                                            to={`/lot/${lot.id}`}
                                                            className="flex-1 sm:flex-none text-center px-4 py-3 rounded-lg text-xs bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold transition-colors border border-white/10">
                                                            Rapor İncele
                                                        </Link>
                                                        <button
                                                            onClick={() => { setCheckoutLot(lot); setStep(3); }}
                                                            className={`flex-[2] sm:flex-none px-6 py-3 rounded-lg text-sm group-hover:shadow-lg ${lot.has_idle_alert ? 'bg-amber-600 hover:bg-amber-500 text-white font-bold group-hover:shadow-amber-500/30' : 'btn-accent group-hover:shadow-accent/30'}`}>
                                                            Sözleşme Kur
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 3: ESCROW CHECKOUT */}
                        {step === 3 && checkoutLot && (
                            <motion.div key="checkout" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                <div className="text-center mb-12">
                                    <ShieldCheck size={50} className="text-primary mx-auto mb-4" />
                                    <h2 className="text-4xl font-black text-white tracking-tighter">Güvenli Ödeme (Escrow)</h2>
                                    <p className="text-textMuted mt-2">Tutarınız global hesaba alınır, mal size ulaşıp testten geçene kadar satıcıya aktarılmaz.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-surface/50 border border-white/10 p-8 rounded-2xl">
                                        <h3 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h3>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between border-b border-border pb-4">
                                                <span className="text-textMuted">Referans Ürün</span>
                                                <strong className="text-white">{checkoutLot.material_type} (EcoGrade Onaylı)</strong>
                                            </div>
                                            <div className="flex justify-between border-b border-border pb-4">
                                                <span className="text-textMuted">Net Miktar</span>
                                                <strong className="text-white">{checkoutLot.quantity_tons} Ton</strong>
                                            </div>
                                            <div className="flex justify-between border-b border-border pb-4">
                                                <span className="text-textMuted">Teslimat (Incoterms)</span>
                                                <strong className="text-white">EXW Depo Teslim</strong>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xl">
                                            <span className="font-semibold text-white">Toplam:</span>
                                            <span className="text-3xl font-black text-accent">${(checkoutLot.quantity_tons * checkoutLot.selling_price_usd).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between">
                                        <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl flex items-start gap-4">
                                            <ShieldCheck className="text-accent shrink-0 mt-1" size={24} />
                                            <p className="text-sm leading-relaxed text-textMuted">
                                                Bu meblağ <strong className="text-white">EcoGrade Global Güvenli Havuzuna</strong> yatar. Test sonuçları beyan edilenle uyuşup araç deponuzdan çıkana kadar satıcının hesabına aktarılmaz.
                                            </p>
                                        </div>

                                        <button onClick={handleCheckout} className="btn-accent w-full py-6 text-xl shadow-lg shadow-accent/30 mt-8">
                                            Parayı Blokeye Al (Öde)
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: SUCCESS */}
                        {step === 4 && (
                            <motion.div key="success" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="py-12 w-full">
                                <div className="text-center mb-16">
                                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                        <CheckCircle2 size={50} className="text-primary" />
                                        <span className="absolute inset-0 rounded-full border border-primary animate-ping"></span>
                                    </div>
                                    <h2 className="text-4xl font-extrabold text-white mb-4">Fonlar Bloke Edildi!</h2>
                                    <p className="text-lg text-textMuted">Tutarınız global hesaba alındı, EcoGrade Exper doğrulama süreci başladı.</p>
                                </div>

                                {/* Tracker UI */}
                                <div className="max-w-2xl mx-auto">
                                    <div className="relative">
                                        <div className="absolute left-[20px] top-10 bottom-10 w-1 bg-border rounded-full z-0"></div>

                                        <div className="space-y-8 relative z-10">
                                            <div className="flex items-start gap-6">
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/50">
                                                    <CheckCircle2 size={24} className="text-background" />
                                                </div>
                                                <div className="pt-2">
                                                    <h4 className="text-lg font-bold text-white">1. Escrow'a Fon Transferi Başarılı</h4>
                                                    <p className="text-sm text-textMuted mt-1">Sözleşme tutarı havuza alındı ve bloke edildi.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-6">
                                                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/50">
                                                    <CircleDashed size={24} className="text-white animate-spin-slow" />
                                                </div>
                                                <div className="pt-2 w-full">
                                                    <h4 className="text-lg font-bold text-white">2. Laboratuvar Nihai Testi (EcoGrade Exper)</h4>
                                                    <p className="text-sm text-accent mt-1 mb-4 animate-pulse">Uzman test uzmanlarımız şu an partiden sample (numune) alıyor ve TDS ile karşılaştırıyor...</p>

                                                    {/* Simulation of Dispute - Hardcoded to show after 5 seconds in real app, we show the UI design directly here */}
                                                    <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl relative overflow-hidden mt-4">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                                        <h5 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                                            <Activity size={16} /> Exper Uyarısı: Kısmi Uyumsuzluk
                                                        </h5>
                                                        <p className="text-sm text-white/80 mb-4">
                                                            Laboratuvar analizlerinde nem oranın TDS beyanından %4 fazla olduğu saptanmıştır. Bu durum üretim firenizi etkileyecektir.
                                                        </p>
                                                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-lg mb-4">
                                                            <div className="text-sm text-textMuted">Platform İskonto Önerisi:</div>
                                                            <div className="text-xl font-bold text-red-500">-%8 İndirim</div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => alert("Anlaşmazlık (Dispute) kaydı başlatıldı. Broker temsilcimiz satıcı ile temasa geçiyor.")} className="btn-secondary flex-1 py-2 text-sm">
                                                                Aracı İste (Dispute)
                                                            </button>
                                                            <button onClick={() => { alert("Yeni indirimli fiyat kabul edildi. Lojistik süreci başlatılıyor."); setStep(3); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex-1 text-sm transition-colors">
                                                                İndirimi Kabul Et
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-6 opacity-30">
                                                <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center shrink-0">
                                                    <Factory size={20} className="text-textMuted" />
                                                </div>
                                                <div className="pt-2">
                                                    <h4 className="text-lg font-bold text-white">3. Lojistik ve Teslimat İşlemleri</h4>
                                                    <p className="text-sm text-textMuted mt-1">Uyuşmazlık çözümü veya test onayı sonrası araç depo yüklemesine başlayacak.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 text-center">
                                    <button onClick={() => navigate('/')} className="btn-secondary mx-auto">
                                        Ana Ekrana Dön
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            <style>{`
             .animate-spin-slow {
                 animation: spin 3s linear infinite;
             }
            `}</style>
        </div>
    );
};

export default BuyWorkflow;
