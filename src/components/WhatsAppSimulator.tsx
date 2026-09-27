import React, { useState } from 'react';
import { MessageSquare, Send, CheckCheck, Phone, Video, MoreVertical, Sparkles, RotateCcw } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface WhatsAppSimulatorProps {
  language: Language;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [msgInput, setMsgInput] = useState('');
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const initialChat: ChatMessage[] = [
    {
      sender: 'bot',
      text: "Namaskar! Welcome to SkillBridge Maharashtra WhatsApp Career Bot (SIH26134).\n\nReply with a number:\n1. 📊 My Skill Gap Report\n2. 🎓 Subsidized Courses in Pune\n3. 🗺️ Full Stack Developer Roadmap\n4. 🏛️ Connect with District Mentor",
      time: "10:00 AM"
    }
  ];

  const [chat, setChat] = useState<ChatMessage[]>(initialChat);

  const triggerBotReply = (userQuery: string) => {
    const q = userQuery.trim().toLowerCase();
    let reply = "";

    if (q === "1" || q.includes("gap") || q.includes("score")) {
      reply = "📊 *Skill Gap Analysis (COEP Pune Hub)*\nTarget Role: Full Stack Developer\n- Matched: HTML, CSS, JavaScript, SQL (52.2% Weighted)\n- Missing: React (High), Node.js (High), REST APIs (High), Git (Med)\n\nClosing React and Node.js will lift your score to 85%!";
    } else if (q === "2" || q.includes("course") || q.includes("learn")) {
      reply = "🎓 *Top Subsidized Course in Pune*\n- Course: Enterprise Full-Stack Web Development\n- Provider: Skill India Digital Hub & MSBTE\n- Fee: Subsidized / Free for Maharashtra Residents\n- Link: skillindiadigital.gov.in/courses/full-stack-mah";
    } else if (q === "3" || q.includes("roadmap") || q.includes("step")) {
      reply = "🗺️ *Full Stack Career Roadmap (8 Steps)*\n1. HTML5 & CSS3 (Done ✅)\n2. JavaScript ES6+ (Done ✅)\n3. React.js & State (Learning 🔄)\n4. Node.js & Express (Next ⏳)\n5. SQL & PostgreSQL (Done ✅)";
    } else if (q === "4" || q.includes("mentor") || q.includes("district")) {
      reply = "🏛️ *District Skill Mentorship Cell - Pune*\nLocation: Government Polytechnic Pune, Shivajinagar\nContact Officer: Dr. S. K. Kulkarni\nToll-Free Helpline: 1800-120-8040";
    } else {
      reply = `Thanks for your query: "${userQuery}". You can type 1 for Skill Gap, 2 for Courses, 3 for Roadmap, or 4 for District Mentorship.`;
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeout(() => {
      setChat(prev => [...prev, {
        sender: 'bot',
        text: reply,
        time: currentTime
      }]);
    }, 600);
  };

  const handleSend = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || msgInput;
    if (!query.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat: ChatMessage[] = [
      ...chat,
      { sender: 'user', text: query, time: currentTime }
    ];
    setChat(newChat);
    setMsgInput('');
    triggerBotReply(query);
  };

  const handleCallClick = (type: 'phone' | 'video') => {
    setCallNotice(`Connecting to Maharashtra Youth Skill Assistance (${type === 'video' ? 'Video Helpdesk' : 'Audio Helpline'} 1800-120-8040)...`);
    setTimeout(() => setCallNotice(null), 4000);
  };

  const quickReplies = [
    { label: "1. Skill Gap Report", value: "1" },
    { label: "2. Subsidized Courses", value: "2" },
    { label: "3. Full Stack Roadmap", value: "3" },
    { label: "4. Pune District Mentor", value: "4" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>
            Rural & Low-Bandwidth Accessibility (SIH Differentiator 5)
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {t.nav_whatsapp}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Interactive smartphone simulation delivering career intelligence via WhatsApp for non-smartphone or rural youth.
          </p>
        </div>

        <button
          onClick={() => setChat(initialChat)}
          className="btn-secondary"
          style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
        >
          <RotateCcw size={14} /> Reset Chat
        </button>
      </div>

      {callNotice && (
        <div style={{
          background: 'rgba(0, 168, 132, 0.2)',
          border: '1px solid #00a884',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          color: '#25d366',
          fontSize: '0.85rem',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center'
        }}>
          {callNotice}
        </div>
      )}

      {/* Simulated Smartphone Frame */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0b141a',
        borderRadius: '32px',
        border: '8px solid #1f2c34',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '620px'
      }}>
        {/* WhatsApp Header */}
        <div style={{
          background: '#202c33',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#e9edef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#00a884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              SB
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                SkillBridge Maharashtra
              </div>
              <div style={{ fontSize: '0.7rem', color: '#00a884' }}>
                Official Government Bot • Online
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', color: '#aebac1' }}>
            <button
              onClick={() => handleCallClick('video')}
              style={{ background: 'transparent', border: 'none', color: '#aebac1', cursor: 'pointer', padding: '0.3rem' }}
              title="Start Video Helpdesk Call"
            >
              <Video size={18} />
            </button>
            <button
              onClick={() => handleCallClick('phone')}
              style={{ background: 'transparent', border: 'none', color: '#aebac1', cursor: 'pointer', padding: '0.3rem' }}
              title="Start Audio Helpdesk Call"
            >
              <Phone size={18} />
            </button>
            <button
              onClick={() => handleSend(undefined, "Help")}
              style={{ background: 'transparent', border: 'none', color: '#aebac1', cursor: 'pointer', padding: '0.3rem' }}
              title="Options"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}>
          {chat.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? '#005c4b' : '#202c33',
                color: '#e9edef',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                whiteSpace: 'pre-line',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              <div>{m.text}</div>
              <div style={{ fontSize: '0.65rem', color: '#8696a0', textAlign: 'right', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                <span>{m.time}</span>
                {m.sender === 'user' && <CheckCheck size={13} color="#53bdeb" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reply Chips */}
        <div style={{
          background: '#182229',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          {quickReplies.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, r.value)}
              style={{
                background: '#202c33',
                border: '1px solid rgba(0, 168, 132, 0.4)',
                borderRadius: '100px',
                padding: '0.3rem 0.65rem',
                color: '#00a884',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* WhatsApp Input Bar */}
        <form onSubmit={handleSend} style={{
          background: '#202c33',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <input
            type="text"
            placeholder="Type 1, 2, 3, or query..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            style={{
              flex: 1,
              background: '#2a3942',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              color: '#e9edef',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!msgInput.trim()}
            style={{
              background: msgInput.trim() ? '#00a884' : '#2a3942',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: msgInput.trim() ? 'pointer' : 'default',
              transition: 'background 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
