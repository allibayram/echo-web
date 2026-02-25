import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Building2, FileText, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        taxNumber: '',
        contactName: '',
        phone: '',
        email: '',
        role: 'SELLER'
    });

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        // Şifre eşleşme kontrolü
        if (formData.password !== formData.passwordConfirm) {
            setPasswordError('Şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin.');
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setPasswordError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            setIsLoading(false);
            setStep(3); // Success step
        } catch (err) {
            setPasswordError(err.message || 'Kayıt sırasında bir hata oluştu.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center relative px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Stepper Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-white mb-2">Kurumsal KYC Başvurusu</h1>
                        <p className="text-textMuted">EcoGrade B2B platformuna katılmak için şirket bilgilerinizi doğrulayın.</p>

                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-background' : 'bg-surface border border-border text-textMuted'}`}>1</div>
                                <span className={`text-sm font-semibold ${step >= 1 ? 'text-white' : 'text-textMuted'}`}>Firma Bilgileri</span>
                            </div>
                            <div className={`h-px flex-1 ${step >= 2 ? 'bg-primary/50' : 'bg-border'}`}></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-background' : 'bg-surface border border-border text-textMuted'}`}>2</div>
                                <span className={`text-sm font-semibold ${step >= 2 ? 'text-white' : 'text-textMuted'}`}>Profil & Onay</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {step === 1 && (
                            <motion.form
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleNext}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Firma Ticari Ünvanı</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Building2 size={16} className="text-white/40" />
                                            </div>
                                            <input type="text" required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm" placeholder="Örn: ABC Plastik A.Ş." />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Vergi Numarası / VAT</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Hash size={16} className="text-white/40" />
                                            </div>
                                            <input type="text" required name="taxNumber" value={formData.taxNumber} onChange={handleChange} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="1234567890" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Platformdaki Ana Rolünüz</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setFormData({ ...formData, role: 'SELLER' })}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.role === 'SELLER' ? 'border-primary bg-primary/10' : 'border-white/10 bg-[#0F172A]/50 hover:bg-[#0F172A]'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-white">Tedarikçi (Satıcı)</span>
                                                {formData.role === 'SELLER' && <CheckCircle2 size={18} className="text-primary" />}
                                            </div>
                                            <p className="text-xs text-textMuted">Stok fazlası, off-grade ve prime hammadde satışları için.</p>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.role === 'BUYER' ? 'border-primary bg-primary/10' : 'border-white/10 bg-[#0F172A]/50 hover:bg-[#0F172A]'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-white">Alıcı</span>
                                                {formData.role === 'BUYER' && <CheckCircle2 size={18} className="text-primary" />}
                                            </div>
                                            <p className="text-xs text-textMuted">Uygun fiyatlı ve sertifikalı hammadde tedariği için.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <Link to="/login" className="text-sm text-textMuted hover:text-white transition-colors">Zaten hesabım var</Link>
                                    <button type="submit" className="bg-white hover:bg-gray-200 text-black font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 text-sm">
                                        Devam Et <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6">
                                    <h4 className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1"><FileText size={16} /> KYC yetkilendirmesi gerekli</h4>
                                    <p className="text-xs text-blue-300/80 leading-relaxed">Şirketiniz adına platformda işlem yapmaya yetkili kişinin iletişim bilgilerini giriniz. Bu bilgiler güvenlik teyidi için kullanılacaktır.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Yetkili Ad Soyad</label>
                                        <input type="text" required name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm" placeholder="Örn: Ahmet Yılmaz" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Kurumsal E-posta</label>
                                            <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="yetkili@firma.com" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Telefon Numarası</label>
                                            <input type="tel" required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="+90 5XX XXX XX XX" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Şifre Belirleyin</label>
                                        <input type="password" required autoComplete="new-password" minLength={6} value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="Min. 6 karakter" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Şifre Tekrar</label>
                                        <input type="password" required autoComplete="new-password" minLength={6} value={formData.passwordConfirm || ''} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="Şifrenizi tekrar girin" />
                                    </div>

                                    {passwordError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                            {passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <button type="button" onClick={() => setStep(1)} className="text-sm text-textMuted hover:text-white transition-colors">Geri Dön</button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-primary hover:bg-primary/90 text-background font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 text-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isLoading ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">KYC Başvurusu Alındı</h3>
                                <p className="text-textMuted mb-8 max-w-md mx-auto">
                                    Sayın {formData.contactName}, {formData.companyName} adına yaptığınız ön başvuru başarıyla alındı. Kayıtlı e-postanıza gönderilen onay linkine tıklayarak işleminizi tamamlayabilirsiniz.
                                </p>
                                <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all border border-white/20">
                                    Ana Ekrana Dön
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
