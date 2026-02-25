import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, User, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecograde-broker1.vercel.app';

export default function Messages() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchInbox();
    }, [token]);

    const fetchInbox = async () => {
        try {
            const res = await fetch(`${API_URL}/messages/inbox/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (e) {
            console.error('Failed to fetch inbox', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const res = await fetch(`${API_URL}/messages/${convId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error('Failed to fetch messages', e);
        }
    };

    const handleSelectConv = (conv) => {
        setSelectedConv(conv);
        fetchMessages(conv.id);
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv) return;
        setSendingMessage(true);
        try {
            const res = await fetch(`${API_URL}/messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: selectedConv.other_user_id,
                    text: newMessage.trim(),
                    lot_id: selectedConv.lot_id || null
                })
            });
            if (res.ok) {
                setNewMessage('');
                fetchMessages(selectedConv.id);
            }
        } catch (e) {
            console.error('Failed to send message', e);
        } finally {
            setSendingMessage(false);
        }
    };

    if (!user) return null;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-6">
                <ArrowLeft size={18} /> Ana Sayfa
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MessageCircle className="text-primary" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Mesajlarım</h1>
                    <p className="text-sm text-textMuted">Alıcı ve satıcılarla doğrudan iletişim kurun</p>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: '500px' }}>
                <div className="flex h-full" style={{ minHeight: '500px' }}>

                    {/* Conversation List */}
                    <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-white/5 bg-surface/30`}>
                        <div className="p-4 border-b border-white/10 bg-surface/50">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Konuşmalar</h3>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <MessageCircle size={40} className="text-white/10 mb-4" />
                                <p className="text-textMuted text-sm">Henüz mesajınız yok</p>
                                <p className="text-textMuted text-xs mt-1">Bir ürünle ilgilendiğinizde buradan iletişime geçebilirsiniz.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => handleSelectConv(conv)}
                                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-3 ${selectedConv?.id === conv.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <User size={18} className="text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white text-sm font-semibold truncate">{conv.other_user_name || 'Kullanıcı'}</span>
                                                <span className="text-textMuted text-[10px] shrink-0 ml-2">
                                                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString('tr-TR') : ''}
                                                </span>
                                            </div>
                                            <p className="text-textMuted text-xs truncate mt-0.5">{conv.last_message || 'Yeni konuşma'}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-white/20 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message Area */}
                    <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                        {selectedConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-white/10 bg-surface/50 flex items-center gap-3">
                                    <button onClick={() => setSelectedConv(null)} className="md:hidden text-textMuted hover:text-white">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User size={14} className="text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-white text-sm font-bold">{selectedConv.other_user_name || 'Kullanıcı'}</span>
                                        {selectedConv.lot_id && (
                                            <span className="text-textMuted text-[10px] ml-2">LOT-{selectedConv.lot_id}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '300px' }}>
                                    {messages.length === 0 ? (
                                        <div className="text-center text-textMuted text-sm py-12">
                                            Henüz mesaj yok. İlk mesajı gönderin!
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender_id === user.id
                                                        ? 'bg-primary/20 text-white rounded-br-md'
                                                        : 'bg-surface border border-white/10 text-white/90 rounded-bl-md'
                                                    }`}>
                                                    <p>{msg.text}</p>
                                                    <span className="text-[10px] text-textMuted mt-1 flex items-center gap-1 justify-end">
                                                        <Clock size={10} />
                                                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-white/10 bg-surface/30">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Mesajınızı yazın..."
                                            className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={sendingMessage || !newMessage.trim()}
                                            className="bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageCircle size={48} className="text-white/10 mb-4" />
                                <h3 className="text-white font-bold mb-2">Bir konuşma seçin</h3>
                                <p className="text-textMuted text-sm max-w-xs">Sol taraftaki listeden bir konuşma seçerek mesajlaşmaya başlayabilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
