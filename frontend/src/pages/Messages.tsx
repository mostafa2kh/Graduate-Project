import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getChatThreads, saveChatThreads, ChatThread, ChatMessage } from '../data/mockUserData';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';
import './Messages.css';

export const Messages: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(() => {
    const all = getChatThreads();
    
    // Only show threads the current user is participating in
    const userThreads = all.filter(t => t.participants.some(p => p.id === user?.id));
    setThreads(userThreads);

    if (threadId) {
      const current = userThreads.find(t => t.id === threadId);
      if (current) setActiveThread(current);
    } else if (userThreads.length > 0) {
      setActiveThread(userThreads[0]);
      navigate(`/dashboard/messages/${userThreads[0].id}`, { replace: true });
    }
  }, [navigate, threadId, user?.id]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadThreads();
  }, [user, navigate, loadThreads]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread || !user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...activeThread.messages, newMessage];
    const updatedThread = { ...activeThread, messages: updatedMessages };

    const allThreads = getChatThreads();
    const newThreadsList = allThreads.map(t => t.id === activeThread.id ? updatedThread : t);
    saveChatThreads(newThreadsList);

    setActiveThread(updatedThread);
    setThreads(newThreadsList.filter(t => t.participants.some(p => p.id === user.id)));
    setInputText('');

    // Trigger simulated host reply after 1.5 seconds if sent by the renter
    if (user.role === 'RENTER') {
      setIsTyping(true);
      setTimeout(() => {
        const hostReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'landlord-1',
          senderName: 'Sarah Landlord',
          text: getSimulatedReply(inputText),
          timestamp: new Date().toISOString()
        };

        const finalMessages = [...updatedMessages, hostReply];
        const finalThread = { ...updatedThread, messages: finalMessages };

        const updatedAllThreads = getChatThreads().map(t => t.id === activeThread.id ? finalThread : t);
        saveChatThreads(updatedAllThreads);

        setActiveThread(finalThread);
        setThreads(updatedAllThreads.filter(t => t.participants.some(p => p.id === user.id)));
        setIsTyping(false);
      }, 1500);
    }
  };

  const getSimulatedReply = (userInput: string): string => {
    const text = userInput.toLowerCase();
    if (text.includes('visit') || text.includes('view') || text.includes('see')) {
      return 'I would love to show you the space! Does this Friday at 3:00 PM work for you?';
    }
    if (text.includes('price') || text.includes('discount') || text.includes('negotiable')) {
      return 'The price is matching the current fair market rate, but we can talk about a discount if you sign a 12-month lease!';
    }
    if (text.includes('deposit') || text.includes('downpayment')) {
      return 'The security deposit is equal to one month of rent. It is held securely and fully refundable when checking out.';
    }
    return 'That sounds excellent! Let me double check with my team and I will send over the formal rental contract proposal.';
  };

  const getChatPartner = (thread: ChatThread) => {
    return thread.participants.find(p => p.id !== user?.id);
  };

  const formatMessageTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-page-container animate-fade-in">
      {/* Threads Side Panel */}
      <aside className="chat-threads-sidebar glass">
        <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
          <span>Active Threads</span>
        </h3>

        {threads.length === 0 ? (
          <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem' }}>No message histories found.</p>
        ) : (
          <div className="threads-list">
            {threads.map(t => {
              const partner = getChatPartner(t);
              const lastMsg = t.messages[t.messages.length - 1];
              const isSelected = activeThread?.id === t.id;
              
              if (!partner) return null;

              return (
                <div 
                  key={t.id} 
                  className={`thread-item glass ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setActiveThread(t);
                    navigate(`/dashboard/messages/${t.id}`);
                  }}
                >
                  <img src={partner.avatar} alt={partner.name} className="thread-avatar" />
                  <div className="thread-brief">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="partner-name">{partner.name}</span>
                      {lastMsg && <span className="last-msg-time">{formatMessageTime(lastMsg.timestamp)}</span>}
                    </div>
                    <p className="last-msg-text">{lastMsg ? lastMsg.text : 'No messages yet'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* Main Chat Feed */}
      <section className="chat-feed-pane glass">
        {activeThread ? (
          <>
            {/* Chat header */}
            <div className="chat-feed-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={getChatPartner(activeThread)?.avatar} alt="" className="active-partner-avatar" />
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{getChatPartner(activeThread)?.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} style={{ color: 'var(--success)' }} />
                    <span>Identity Verified Host</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages-container">
              {activeThread.messages.map(m => {
                const isMine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`message-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && <img src={getChatPartner(activeThread)?.avatar} alt="" className="msg-avatar" />}
                    <div>
                      <div className="message-text-bubble">
                        <p>{m.text}</p>
                      </div>
                      <span className="msg-timestamp">{formatMessageTime(m.timestamp)}</span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="message-bubble-wrapper theirs">
                  <img src={getChatPartner(activeThread)?.avatar} alt="" className="msg-avatar" />
                  <div className="typing-bubble">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Chat input box */}
            <form onSubmit={handleSendMessage} className="chat-input-bar">
              <input 
                type="text" 
                className="form-input chat-input-field" 
                placeholder="Type a message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" className="btn btn-primary chat-send-btn" disabled={!inputText.trim() || isTyping}>
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}>
            <MessageSquare size={48} style={{ marginBottom: '12px' }} />
            <h3>No conversation selected</h3>
            <p>Choose an active thread to start chatting.</p>
          </div>
        )}
      </section>
    </div>
  );
};
