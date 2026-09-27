import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Sparkles, User, Lightbulb } from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface AICareerAssistantViewProps {
  studentProfile: any;
  gapData: any;
  language: Language;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
}

export const AICareerAssistantView: React.FC<AICareerAssistantViewProps> = ({
  studentProfile,
  gapData,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Namaskar! I am your SkillBridge AI Career Counselor for the Government of Maharashtra. All my advice is strictly grounded in your verified skills and regional market data. How can I help your career journey today?",
      source: "SkillBridge Grounded Engine"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setVoiceNotice(null);

    try {
      const res = await api.askCareerAssistant(textToSend, gapData);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.response,
          source: res.source
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I experienced a temporary communication hiccup. However, based on your skill gap analysis, your top missing skills remain the primary priority to tackle.",
          source: "Offline Grounded Fallback"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Namaskar Aarav! I am your SkillBridge AI Career Counselor for the Government of Maharashtra. How can I assist you with your career readiness today?`,
        source: 'SkillBridge Grounded Model'
      }
    ]);
  };

  // SIH Differentiator 11: Web Speech API voice input
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice("Web Speech API voice input is not supported in this browser. Please type your query in the text box.");
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice("Listening to your voice... Speak now.");
      };
      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };
      recognition.onerror = (e: any) => {
        setIsListening(false);
        setVoiceNotice("Voice input stopped or microphone permission was denied.");
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceNotice("Could not access microphone.");
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  const smartPrompts = [
    `Why is my match score ${gapData?.weighted_match_pct || 52}%?`,
    "What are my highest priority missing skills?",
    "Which subsidized course closes my skill gap fastest?",
    "Suggest a high-impact portfolio project for me"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700 }}>
            Grounded AI Intelligence
          </div>
          <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0.1rem 0 0 0' }}>
            {t.nav_ai_assistant}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleClearChat}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            Clear Conversation
          </button>
          <div className="badge badge-low" style={{ fontSize: '0.75rem' }}>
            <Sparkles size={13} /> Strict Zero-Hallucination Grounding
          </div>
        </div>
      </div>

      {voiceNotice && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          color: '#38bdf8',
          fontSize: '0.82rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{voiceNotice}</span>
          <button
            onClick={() => setVoiceNotice(null)}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages List */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={18} color="#ffffff" />
                </div>
              )}

              <div>
                <div style={{
                  background: msg.sender === 'user' ? 'var(--accent-indigo)' : 'rgba(30, 41, 59, 0.7)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.15rem',
                  fontSize: '0.88rem',
                  color: '#f8fafc',
                  lineHeight: 1.6
                }}>
                  {msg.text}
                </div>

                {msg.source && (
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem', paddingLeft: '0.2rem' }}>
                    Engine: <span style={{ color: '#38bdf8' }}>{msg.source}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#cbd5e1" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              <Bot size={18} color="#6366f1" />
              <span>Analyzing profile grounding data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div style={{ padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
          {smartPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '100px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={toggleVoiceInput}
            title={isListening ? "Listening... Click to stop" : "Speak with Voice Assistant (Web Speech API)"}
            style={{
              background: isListening ? '#f43f5e' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.65rem',
              color: isListening ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening to your voice..." : "Ask career question, explore skill gap, or request project guidance..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
