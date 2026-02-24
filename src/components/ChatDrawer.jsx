import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, FileText, CheckCircle2, Factory, Bot } from 'lucide-react';

const ChatDrawer = ({ isOpen, onClose, lotData, sellerName = "EcoGrade Onaylı Satıcı" }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Initial greeting
            setMessages([
                {
                    id: 1,
                    sender: 'system',
                    text: 'Güvenli Pazar Odasına (Escrow Room) bağlandınız. Bu odadaki tüm yazışmalar EcoGrade güvencesi altındadır ve yasal delil niteliği taşır.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                {
                    id: 2,
                    sender: 'seller',
                    text: `Merhaba, #${lotData?.id || 'TX-8921'} referanslı ${lotData?.polimer || 'hammadde'} ilanımız için nasıl yardımcı olabilirim?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [isOpen, lotData, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        // Mock response
        setTimeout(() => {
            setIsTyping(false);

            // Check if it's a price negotiation
            const textL = newMsg.text.toLowerCase();
            let responseText = 'Mesajınız alındı. Temsilcilerimiz en kısa sürede dönüş yapacaktır.';

            if (textL.includes('fiyat') || /\\d+/.test(textL)) {
                responseText = 'Teklifinizi değerlendiriyoruz. Belirttiğiniz lot için limitimiz sistemde tanımlıdır. İsterseniz EcoGrade Escrow üzerinden resmi teklif geçebilirsiniz.';
            } else if (textL.includes('rapor') || textL.includes('test')) {
                responseText = 'Bu lotun EcoGrade laboratuvar sonuçları (MFI, Yoğunluk) ekteki TDS dosyasında günceldir.';
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'seller',
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-[#0F172A] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 relative">
                                    <Factory size={18} />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm leading-tight">{sellerName}</h3>
                                    <div className="flex items-center gap-1 text-xs text-emerald-400 mt-0.5">
                                        <Bot size={12} /> Çevrimiçi
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-textMuted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Lot info sticky bar */}
                        {lotData && (
                            <div className="bg-primary/5 border-b border-primary/10 p-3 shrink-0 flex items-center justify-between">
                                <span className="text-xs font-mono text-textMuted">Ref: #{lotData.id}</span>
                                <span className="text-xs font-bold text-white">{lotData.polimer} • {lotData.qty} Ton • ${lotData.price}/t</span>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0B1120]">
                            {messages.map((msg) => {
                                if (msg.sender === 'system') {
                                    return (
                                        <div key={msg.id} className="flex justify-center my-4">
                                            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg text-xs text-amber-500 text-center max-w-[85%] flex items-start gap-2">
                                                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{msg.text}</span>
                                            </div>
                                        </div>
                                    );
                                }

                                const isMe = msg.sender === 'user';
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary text-background rounded-tr-sm' : 'bg-white/5 border border-white/10 text-white rounded-tl-sm'}`}>
                                            <p className="text-sm shadow-sm">{msg.text}</p>
                                            <div className="flex justify-end gap-1 mt-1">
                                                <span className={`text-[10px] ${isMe ? 'text-background/70' : 'text-textMuted'}`}>{msg.timestamp}</span>
                                                {isMe && <CheckCircle2 size={12} className="text-background/80" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-[#0F172A] shrink-0">
                            {/* Hızlı Teklif Butonları */}
                            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                                <button onClick={() => setInputValue(`$${Math.max(0, (lotData?.price || 1000) - 50)} teklif veriyorum.`)} className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-xs text-primary font-bold whitespace-nowrap transition-colors">
                                    💰 Hızlı Teklif (-$50)
                                </button>
                                <button onClick={() => setInputValue("Orijinallik sertifikası ve güncel analiz raporu talep ediyorum.")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap transition-colors">
                                    📄 Rapor İste
                                </button>
                                <button onClick={() => setInputValue("FOB teslim şartlarında son fiyatınız nedir?")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap transition-colors">
                                    🚢 Lojistik Sorgusu
                                </button>
                            </div>

                            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                <button type="button" className="text-textMuted hover:text-primary transition-colors p-2">
                                    <FileText size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Mesajınızı veya resmi teklifinizi yazın..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className={`absolute right-2.5 p-1.5 rounded-full transition-colors flex items-center justify-center ${inputValue.trim() ? 'bg-primary text-background' : 'bg-white/10 text-white/30'}`}
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <span className="text-[10px] text-textMuted flex items-center justify-center gap-1 font-mono">
                                    <ShieldCheck size={10} /> EcoGrade End-to-End Encryption
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatDrawer;
