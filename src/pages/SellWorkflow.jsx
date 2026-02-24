import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Activity, Box, Search, ShieldCheck, FileUp, CheckCircle2, ChevronRight, UploadCloud, FileText } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Country, State, City } from 'country-state-city';

const SellWorkflow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userPrice, setUserPrice] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [tdsFile, setTdsFile] = useState(null);
    const [isParsingTds, setIsParsingTds] = useState(false);
    const [formData, setFormData] = useState({
        material_type: 'PP',
        material_form: 'Granül',
        color: 'Natürel (Şeffaf)',
        location: '',
        declared_mfi: '',
        declared_density: '',
        quantity_tons: ''
    });

    const [selectedCountry, setSelectedCountry] = useState('TR');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const countries = Country.getAllCountries();
    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
    const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

    useEffect(() => {
        const countryName = Country.getCountryByCode(selectedCountry)?.name || '';
        const stateName = State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name || '';
        const locString = [selectedCity, stateName, countryName].filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, location: locString }));
    }, [selectedCountry, selectedState, selectedCity]);

    const handleTdsUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTdsFile(file.name);
            setIsParsingTds(true);

            // Ocr & AI Parsing Simulation
            setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    declared_mfi: "14.5",
                    declared_density: "0.912"
                }));
                setIsParsingTds(false);
            }, 2000);
        }
    };

    const handleGoToPricingStep = async (e) => {
        e.preventDefault();

        // VALIDATION CHECK
        if (!formData.material_type || !formData.material_form || !formData.color || !formData.declared_mfi || !formData.declared_density || !formData.quantity_tons || !selectedCity) {
            alert('Lütfen fiyata geçmeden önce formdaki tüm zorunlu alanları (Lokasyon dahil) doldurduğunuzdan emin olun.');
            return;
        }

        setLoading(true);

        // Yükleme (AI Pazar Taraması) Animasyonu Simülasyonu
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500); // Sadece hızlı bir pazar tarama hissi
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/3">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8">
                    <ArrowLeft size={20} /> Ana Ekrana Dön
                </button>

                <div className="glass-panel p-8 md:p-10 relative overflow-hidden">

                    {/* Decorative Grid Background */}
                    <div className="absolute inset-0 opacity-50 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")` }}></div>

                    <div className="relative z-10">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: FORM */}
                            {step === 1 && !loading && (
                                <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Activity className="text-primary" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-white mb-2">Trink Satış Oluştur</h2>
                                    </div>
                                    <p className="text-textMuted mb-8 text-sm md:text-base">Değerlerinizi girin, sistemimiz küresel piyasa referanslarını tarasın ve <strong>kendi özgür fiyatınızı</strong> belirleyerek ilana hazırlanın.</p>

                                    <form onSubmit={handleGoToPricingStep} className="space-y-6">
                                        <div className="md:col-span-2">
                                            <label className="form-label">Hammadde Sınıfı (Malzeme Tipi)</label>
                                            <select
                                                className="input-field"
                                                value={formData.material_type}
                                                onChange={e => setFormData({ ...formData, material_type: e.target.value })}
                                            >
                                                <optgroup label="Poliolefinler (PE & PP)">
                                                    <option value="PP" className="bg-surface text-white">Polipropilen Genel (PP)</option>
                                                    <option value="PP-H" className="bg-surface text-white">Polipropilen Homopolimer (PP-H)</option>
                                                    <option value="PP-C" className="bg-surface text-white">Polipropilen Kopolimer (PP-C)</option>
                                                    <option value="PP-R" className="bg-surface text-white">Polipropilen Random Kopolimer (PP-R)</option>
                                                    <option value="LDPE" className="bg-surface text-white">Düşük Yoğunluklu PE (LDPE)</option>
                                                    <option value="LLDPE" className="bg-surface text-white">Lineer Düşük Yoğunluklu PE (LLDPE)</option>
                                                    <option value="HDPE" className="bg-surface text-white">Yüksek Yoğunluklu PE (HDPE)</option>
                                                    <option value="MDPE" className="bg-surface text-white">Orta Yoğunluklu PE (MDPE)</option>
                                                </optgroup>
                                                <optgroup label="Stirenikler & Akrilikler">
                                                    <option value="PS-GP" className="bg-surface text-white">Genel Amaçlı PS (GPPS)</option>
                                                    <option value="PS-HI" className="bg-surface text-white">Yüksek Darbe PS (HIPS)</option>
                                                    <option value="ABS" className="bg-surface text-white">ABS (Akrilonitril Bütadien Stiren)</option>
                                                    <option value="SAN" className="bg-surface text-white">SAN (Stiren Akrilonitril)</option>
                                                    <option value="ASA" className="bg-surface text-white">ASA</option>
                                                    <option value="PMMA" className="bg-surface text-white">PMMA (Akrilik)</option>
                                                </optgroup>
                                                <optgroup label="Mühendislik Plastikleri">
                                                    <option value="PC" className="bg-surface text-white">Polikarbonat (PC)</option>
                                                    <option value="PC-ABS" className="bg-surface text-white">PC/ABS Blend</option>
                                                    <option value="POM" className="bg-surface text-white">POM (Asetal)</option>
                                                    <option value="PET" className="bg-surface text-white">PET</option>
                                                    <option value="PBT" className="bg-surface text-white">PBT</option>
                                                    <option value="PA6" className="bg-surface text-white">Poliamid 6 (PA6)</option>
                                                    <option value="PA66" className="bg-surface text-white">Poliamid 66 (PA66)</option>
                                                </optgroup>
                                                <optgroup label="PVC & Özel Ürünler">
                                                    <option value="PVC-S" className="bg-surface text-white">PVC (Sert)</option>
                                                    <option value="PVC-P" className="bg-surface text-white">PVC (Yumuşak/Esnek)</option>
                                                    <option value="EVA" className="bg-surface text-white">EVA (Etilen Vinil Asetat)</option>
                                                </optgroup>
                                                <optgroup label="Geri Dönüşüm (Recycle)">
                                                    <option value="rPP" className="bg-surface text-white">Geri Dönüşüm PP (rPP)</option>
                                                    <option value="rHDPE" className="bg-surface text-white">Geri Dönüşüm HDPE (rHDPE)</option>
                                                    <option value="rPET" className="bg-surface text-white">Geri Dönüşüm PET (rPET)</option>
                                                </optgroup>
                                                <optgroup label="Elastomerler">
                                                    <option value="TPU" className="bg-surface text-white">TPU (Termoplastik Poliüretan)</option>
                                                    <option value="TPE-S" className="bg-surface text-white">TPE-S / SEBS</option>
                                                    <option value="POE" className="bg-surface text-white">POE (Poliolefin Elastomer)</option>
                                                    <option value="EPDM" className="bg-surface text-white">EPDM</option>
                                                </optgroup>
                                                <optgroup label="Katkı & Masterbatch (Kompaund)">
                                                    <option value="MB-WHT" className="bg-surface text-white">Masterbatch Beyaz</option>
                                                    <option value="MB-BLK" className="bg-surface text-white">Masterbatch Siyah</option>
                                                    <option value="MB-COL" className="bg-surface text-white">Masterbatch Renk</option>
                                                    <option value="CACO3" className="bg-surface text-white">Kalsit (Kalsiyum Karbonat) Dolgulu</option>
                                                    <option value="TALK" className="bg-surface text-white">Talk Dolgulu</option>
                                                    <option value="GF" className="bg-surface text-white">Cam Elyaf (Glass Fiber) Katkılı</option>
                                                </optgroup>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="form-label">Malzeme Formu</label>
                                                <select
                                                    className="input-field"
                                                    value={formData.material_form}
                                                    onChange={e => setFormData({ ...formData, material_form: e.target.value })}
                                                >
                                                    <option value="Granül" className="bg-surface text-white">Orijinal Granül</option>
                                                    <option value="OffGrade" className="bg-surface text-white">Off-Grade Granül</option>
                                                    <option value="Capak" className="bg-surface text-white">Kırık/Çapak (Flake)</option>
                                                    <option value="Balya" className="bg-surface text-white">Balya (Hurda)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label">Malzeme Rengi</label>
                                                <input
                                                    type="text" required
                                                    placeholder="Örn: Şeffaf, Mavi, Siyah"
                                                    className="input-field"
                                                    value={formData.color}
                                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="form-label">Ülke</label>
                                                <select
                                                    className="input-field"
                                                    value={selectedCountry}
                                                    onChange={e => {
                                                        setSelectedCountry(e.target.value);
                                                        setSelectedState('');
                                                        setSelectedCity('');
                                                        const countryName = Country.getCountryByCode(e.target.value)?.name;
                                                        setFormData({ ...formData, location: countryName || '' });
                                                    }}
                                                    required
                                                >
                                                    <option value="">Ülke Seçin</option>
                                                    {countries.map(c => <option key={c.isoCode} value={c.isoCode} className="bg-surface text-white">{c.name}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="form-label">Eyalet / Bölge</label>
                                                <select
                                                    className="input-field"
                                                    value={selectedState}
                                                    onChange={e => {
                                                        setSelectedState(e.target.value);
                                                        setSelectedCity('');
                                                        const countryName = Country.getCountryByCode(selectedCountry)?.name;
                                                        const stateName = State.getStateByCodeAndCountry(e.target.value, selectedCountry)?.name;
                                                        setFormData({ ...formData, location: `${stateName}, ${countryName}` });
                                                    }}
                                                    disabled={!selectedCountry || states.length === 0}
                                                    required={states.length > 0}
                                                >
                                                    <option value="">Bölge Seçin</option>
                                                    {states.map(s => <option key={s.isoCode} value={s.isoCode} className="bg-surface text-white">{s.name}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="form-label">Şehir</label>
                                                <select
                                                    className="input-field"
                                                    value={selectedCity}
                                                    onChange={e => {
                                                        setSelectedCity(e.target.value);
                                                        const countryName = Country.getCountryByCode(selectedCountry)?.name;
                                                        const stateName = State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name;
                                                        // Update the global string representation without causing infinite loops
                                                        setFormData(prev => ({ ...prev, location: `${e.target.value}, ${stateName || ''}, ${countryName || ''}`.replace(/, ,/g, ',').trim().replace(/,$/, '') }));
                                                    }}
                                                    disabled={!selectedState || cities.length === 0}
                                                    required={cities.length > 0}
                                                >
                                                    <option value="">Şehir Seçin</option>
                                                    {cities.map(c => <option key={c.name} value={c.name} className="bg-surface text-white">{c.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* TDS / Reçete Yükleme Alanı Olarak Değiştirildi */}
                                            <div className="md:col-span-2">
                                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden group mb-2">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <FileText size={80} className="text-primary" />
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                                <UploadCloud size={24} className="text-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white text-lg">AI Reçete Okuyucu (TDS/PDF Yükle)</h4>
                                                                <p className="text-sm text-textMuted mt-1">
                                                                    Üreticinin teknik föyünü yükleyin. <strong>Yapay Zeka MFI, Yoğunluk ve diğer kimyasal değerleri otomatik ayıklayarak boşlukları dolduracaktır.</strong> Elle form doldurmaya son verin.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="relative shrink-0">
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.doc,.docx"
                                                                id="tds_upload"
                                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                                                onChange={handleTdsUpload}
                                                            />
                                                            <button type="button" className={`btn-secondary flex items-center gap-2 relative z-0 ${isParsingTds ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                {isParsingTds ? (
                                                                    <><div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div> Ayıklanıyor...</>
                                                                ) : tdsFile ? (
                                                                    <><CheckCircle2 size={16} className="text-primary" /> {tdsFile.substring(0, 15)}...</>
                                                                ) : (
                                                                    "PDF veya DOCX Seçin"
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label flex justify-between">
                                                    <span>Deney/Ölçüm MFI Değeri (g/10dk)</span>
                                                    {tdsFile && !isParsingTds && <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12} /> AI ile Doldu</span>}
                                                </label>
                                                <input
                                                    type="number" step="0.01" required
                                                    placeholder="Örn: 12.5"
                                                    className={`input-field transition-all duration-500 ${tdsFile && !isParsingTds ? 'border-primary shadow-[0_0_10px_rgba(16,185,129,0.2)] bg-primary/5 text-primary' : ''}`}
                                                    value={formData.declared_mfi}
                                                    onChange={e => setFormData({ ...formData, declared_mfi: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label flex justify-between">
                                                    <span>Yoğunluk - Density (g/cm³)</span>
                                                    {tdsFile && !isParsingTds && <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12} /> AI ile Doldu</span>}
                                                </label>
                                                <input
                                                    type="number" step="0.001" required
                                                    placeholder="Örn: 0.905"
                                                    className="input-field"
                                                    value={formData.declared_density}
                                                    onChange={e => setFormData({ ...formData, declared_density: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label">Numune / Parti Fotoğrafı (Opsiyonel)</label>
                                            <div className="border border-dashed border-primary/30 rounded-xl p-4 flex flex-col items-center justify-center text-textMuted bg-surface/30 cursor-pointer hover:bg-surface/50 transition-colors">
                                                <input type="file" accept="image/*" className="hidden" id="photo_upload" onChange={e => setPhotoName(e.target.files[0]?.name || "")} />
                                                <label htmlFor="photo_upload" className="cursor-pointer text-center w-full block py-6">
                                                    <Box size={32} className="mx-auto mb-3 opacity-50" />
                                                    <span className="text-sm font-medium">{photoName ? photoName : "📸 Fotoğraf Yüklemek İçin Tıklayın veya Sürükleyin"}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label">Satılacak Toplam Miktar (Ton)</label>
                                            <div className="relative">
                                                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
                                                <input
                                                    type="number" required
                                                    placeholder="Örn: 24"
                                                    className="input-field pl-12 focus:ring-primary"
                                                    value={formData.quantity_tons}
                                                    onChange={e => setFormData({ ...formData, quantity_tons: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-4 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <ShieldCheck size={80} className="text-primary" />
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="pt-1">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="exper-opt-in"
                                                            className="w-5 h-5 appearance-none border-2 border-primary rounded bg-transparent checked:bg-primary cursor-pointer peer transition-colors"
                                                            defaultChecked
                                                        />
                                                        <CheckCircle2 size={14} className="absolute inset-0 m-auto text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="exper-opt-in" className="font-bold text-white text-lg flex items-center gap-2 cursor-pointer">
                                                        <ShieldCheck size={18} className="text-primary" /> Ücretsiz EcoGrade Exper İncelemesi İzin Ver
                                                    </label>
                                                    <p className="text-sm text-textMuted mt-1">
                                                        Malzemeniz alıcı deposuna gitmeden önce bağımsız laboratuvarlarımızda test edilir. <strong>TDS uyumu %100 onaylandığında "EcoGrade Garantili Seller" rozeti kazanıp satış hızınızı 5x artırırsınız.</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent -mx-2 px-2">
                                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group py-4 text-lg">
                                                <Search size={20} className="group-hover:animate-pulse" />
                                                Piyasayı İncele & Fiyat Belirle
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* LOADING: AI SCANNING SKELETON */}
                            {loading && (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent flex flex-col items-center justify-center p-8 z-20">
                                        <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"></div>
                                        <h3 className="text-2xl font-bold text-white mb-2 blink">Canlı Piyasa Taranıyor...</h3>
                                        <p className="text-primary/80 font-medium font-mono text-sm max-w-sm text-center">Girilen teknik verilere uygun küresel muadiller bulunuyor.</p>
                                    </div>
                                    <div className="w-full max-w-xs h-2 bg-black/50 rounded-full mt-10 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-accent w-1/2 animate-[ticker_1.5s_ease-in-out_infinite]"></div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: USER PRICING & MARKET MOCKUP */}
                            {step === 2 && (
                                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                                    <div className="text-center mb-10">
                                        <div className="w-16 h-16 bg-[#0F172A] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-black/50">
                                            <Activity size={28} className="text-primary" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Piyasa Referansları & Fiyatlandırma</h2>
                                        <p className="text-sm text-textMuted max-w-lg mx-auto leading-relaxed">Sistemde teknik verilerinize uygun bulunan <strong>{formData.material_type}</strong> emsallerini değerlendirip, kendi global hedefinizi belirleyin.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                                        {/* Kullanıcı Fiyat Girişi (Ana Kolon) */}
                                        <div className="lg:col-span-7 bg-[#0A101D] border border-white/5 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center shadow-2xl">
                                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                                <Box size={200} />
                                            </div>

                                            <div className="relative z-10 w-full">
                                                <label className="text-gray-400 font-medium mb-4 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div> Sizin Belirlediğiniz Hedef Fiyat
                                                </label>

                                                <div className="flex items-baseline gap-2 mb-8 group">
                                                    <span className="text-4xl text-gray-500 font-medium font-serif">$</span>
                                                    <input
                                                        type="number"
                                                        className="bg-transparent text-5xl md:text-7xl font-light text-white focus:outline-none w-full placeholder-white/5 transition-all"
                                                        placeholder="0.00"
                                                        value={userPrice}
                                                        onChange={e => setUserPrice(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <span className="text-xl text-textMuted whitespace-nowrap font-light border-l border-white/10 pl-4 ml-2">/ Ton</span>
                                                </div>

                                                <div className="pt-6 border-t border-white/5 flex justify-between items-center bg-[#050A15]/50 -mx-8 -mb-8 px-8 py-6">
                                                    <div>
                                                        <span className="block text-[10px] uppercase tracking-widest text-textMuted mb-1">Beklenen Hasılat</span>
                                                        <span className="text-xl font-bold text-white flex items-center gap-2">
                                                            ${((parseFloat(userPrice) || 0) * (parseFloat(formData.quantity_tons) || 0)).toLocaleString()} <span className="text-xs font-normal text-textMuted">USD Toplam</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emsal Listesi (Yan Kolon) */}
                                        <div className="lg:col-span-5 bg-[#0F172A]/50 border border-white/5 p-6 rounded-3xl flex flex-col">
                                            <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-6 flex items-center justify-between">
                                                <span className="flex items-center gap-2"><Activity size={14} className="text-accent" /> Canlı Emsaller</span>
                                                <span className="text-textMuted font-normal text-[10px]">Türev Eşleşmeler</span>
                                            </h4>

                                            <div className="flex flex-col gap-3 flex-1">
                                                {[
                                                    { id: "LOT-612", type: formData.material_type, mfi: (parseFloat(formData.declared_mfi) || 10) + 1.2, loc: "Gebze / TR", price: "$1,150", date: "4 sa" },
                                                    { id: "LOT-589", type: formData.material_type, mfi: (parseFloat(formData.declared_mfi) || 10) - 0.8, loc: "Antwerp / BE", price: "$1,210", date: "1 G" },
                                                    { id: "LOT-441", type: formData.material_type, mfi: formData.declared_mfi || "10", loc: "Texas / US", price: "$1,090", date: "3 G" }
                                                ].map((mock, i) => (
                                                    <div key={i} className="flex justify-between items-center bg-[#050A15] border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors group">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-white text-xs font-bold leading-none">{mock.type}</span>
                                                            <span className="text-gray-500 text-[10px] flex items-center gap-1.5">
                                                                MFI: {mock.mfi} <span className="w-1 h-1 rounded-full bg-white/20"></span> {mock.loc}
                                                            </span>
                                                        </div>
                                                        <div className="text-right flex flex-col gap-1.5 relative">
                                                            <span className="text-emerald-400 font-bold text-sm tracking-wide leading-none">{mock.price} <span className="text-[10px] text-emerald-400/50">/T</span></span>
                                                            <span className="text-gray-600 text-[9px] uppercase tracking-wider">{mock.date} Önce</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#050A15] border border-white/5 p-5 rounded-2xl text-xs leading-relaxed text-textMuted mb-8 flex gap-4 items-start shadow-inner">
                                        <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                                            <ShieldCheck size={20} className="text-primary" />
                                        </div>
                                        <p className="pt-0.5">
                                            <strong className="text-white">Ek Bilgilendirme:</strong> {
                                                (() => {
                                                    const isRecycle = formData.material_type.startsWith('r') || formData.material_type.includes('Recycle');
                                                    const isOffGrade = formData.material_form === 'OffGrade' || formData.material_form === 'Capak' || formData.material_form === 'Balya';
                                                    const isPrime = !isRecycle && !isOffGrade;

                                                    return isPrime
                                                        ? `Girdiğiniz fiyat direkt olarak işleme alınacak ve satış tahtasında listelenecektir. Alıcı bulunduğunda lojistik kodunuz oluşacaktır.`
                                                        : `Ürününüz Orijinal (Prime) olmadığı için platform tarafından EcoGrade Exper (laboratuvar testi) yapıldıktan sonra kesin onaylı olarak listelenecektir.`;
                                                })()
                                            }
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button onClick={() => setStep(1)} className="btn-secondary w-full col-span-1">
                                            Geri Dön / İptal
                                        </button>
                                        <button onClick={async () => {
                                            if (!userPrice || parseFloat(userPrice) <= 0) {
                                                alert("Devam etmek için lütfen geçerli bir satış fiyatı girin.");
                                                return;
                                            }
                                            try {
                                                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                                                await axios.post(`${API_URL}/offers/`, {
                                                    material_type: formData.material_type,
                                                    material_form: formData.material_form,
                                                    declared_mfi: parseFloat(formData.declared_mfi),
                                                    declared_density: parseFloat(formData.declared_density),
                                                    quantity_tons: parseFloat(formData.quantity_tons),
                                                    ai_estimated_price_usd: parseFloat(userPrice) // Geçici olarak backend bu alanı alıyor. (Sonradan DB kolon ismi değiştirilebilir)
                                                });
                                                alert("İlanınız başarıyla işleme alındı!\n\nDurumu panosundan takip edebilirsiniz.");
                                                navigate('/');
                                            } catch (err) {
                                                alert("İlan oluşturulurken bir hata oluştu.");
                                            }
                                        }} className="btn-primary w-full col-span-2">
                                            Fiyatı Onayla ve Gönder
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ORDERBOOK / MARKET INTELLIGENCE PANEL */}
            <div className="w-full lg:w-1/3 mt-16 lg:mt-0">
                <div className="sticky top-28">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-primary" /> Canlı Emir Defteri
                    </h3>
                    <div className="glass-panel p-6 flex flex-col gap-4">
                        {[
                            { type: "ALIM", material: "PP Homopolimer", mfi: "12.0", qty: "40 Ton", price: "$1,210", time: "2 dk önce" },
                            { type: "SATIM", material: "HDPE Film", mfi: "0.9", qty: "20 Ton", price: "$1,085", time: "15 dk" },
                            { type: "ALIM", material: "PET Flake", mfi: "N/A", qty: "100 Ton", price: "$930", time: "45 dk" },
                            { type: "SATIM", material: "LDPE Enjeksiyon", mfi: "20.0", qty: "15 Ton", price: "$1,150", time: "1 sa" },
                            { type: "ALIM", material: "PVC Süspansiyon", mfi: "K67", qty: "80 Ton", price: "$900", time: "3 sa" },
                        ].map((order, index) => (
                            <div key={index} className="flex flex-col gap-2 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-colors w-full break-words">
                                <div className="flex justify-between items-center text-[10px] sm:text-xs text-textMuted font-mono">
                                    <span className={order.type === "ALIM" ? "text-primary" : "text-accent"}>{order.type} EMRI</span>
                                    <span>{order.time}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-sm sm:text-base">
                                    <span className="text-white truncate max-w-[60%]">{order.material}</span>
                                    <span className="text-white">{order.price}/t</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] sm:text-xs text-textMuted">
                                    <span>Spek: {order.mfi}</span>
                                    <span>Hacim: {order.qty}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellWorkflow;
