import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { user, login } = useAuth();

    // Giriş yapan kullanıcı login sayfasına gelirse yönlendir
    if (user) {
        if (user.role === 'AGENT') {
            navigate('/agent');
        } else {
            navigate('/');
        }
        return null;
    }

    // Kayıtlı kullanıcı kontrolü gerçek API'den yapılıyor

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const userData = await login(email, password);
            setIsLoading(false);
            if (userData.role === 'AGENT' || userData.role === 'admin') {
                navigate('/agent');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Geçersiz e-posta veya şifre kombinasyonu.');
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-[85vh] flex items-center justify-center relative px-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Glossy highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                    <div className="mb-10 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white mb-4">
                            EcoGrade <span className="text-primary flex items-center"><Sparkles size={20} className="mr-1" />Broker</span>
                        </Link>
                        <h1 className="text-xl text-textMuted font-medium">B2B Ticaret Portalına Giriş</h1>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3 text-sm">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider ml-1">Kurumsal E-posta</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-white/40" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                    placeholder="ornek@firma.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Şifre</label>
                                <button type="button" onClick={() => alert("Şifre sıfırlama linki kayıtlı e-posta adresinize gönderilecektir. Lütfen e-postanızı kontrol edin.")} className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">Şifremi Unuttum</button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-white/40" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-primary hover:bg-primary/90 text-background font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin"></div>
                                        <span>Yetkilendiriliyor...</span>
                                    </>
                                ) : (
                                    <>
                                        Sisteme Giriş Yap <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-textMuted">
                            EcoGrade platformunda henüz hesabınız yok mu? <br />
                            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 mt-2 inline-block">Kurumsal KYC Başvurusu Yapın</Link>
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center items-center gap-2 text-xs text-emerald-500/70 font-mono bg-emerald-500/5 py-2 rounded">
                        <ShieldCheck size={14} /> 256-bit SSL Secure Login
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
