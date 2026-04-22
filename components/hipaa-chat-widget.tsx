'use client'

/**
 * HIPAA chat widget — floating bubble that opens a pinned chat panel.
 * Adapted from 0ncore's ChatWidget, rebranded for RocketOpp HIPAA (red/orange).
 * Calls /api/hipaa/chat which wraps the /api/k/hipaa K-layer synthesis.
 */

import { useState, useRef, useEffect } from 'react'
import { Shield, Send, X, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: Array<{ rule: string; title: string }>
}

interface HipaaChatWidgetProps {
  /** Optional page context that gets sent with every message (e.g. scan finding JSON) */
  context?: string
  /** Preset greeting and quick-action suggestions */
  greeting?: string
  suggestions?: string[]
}

const DEFAULT_GREETING =
  "Hey — I'm the RocketOpp HIPAA assistant. Ask me about any 45 CFR §164 rule, the 2026 NPRM changes, or what to do about a specific scan finding. What do you want to know?"

const DEFAULT_SUGGESTIONS = [
  'What does §164.312(d) require?',
  'What changes with the 2026 NPRM?',
  'Is MFA required under HIPAA?',
  'What are the penalty tiers?',
]

export function HipaaChatWidget({ context, greeting, suggestions }: HipaaChatWidgetProps = {}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ role: 'assistant', content: greeting || DEFAULT_GREETING }])
      setGreeted(true)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, greeted, greeting])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(override?: string) {
    const text = (override ?? input).trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/hipaa/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || data.error || 'Something went wrong. Please try again.',
          citations: data.citations,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again in a moment.' },
      ])
    }
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const quickActions = suggestions || DEFAULT_SUGGESTIONS

  return (
    <>
      {/* Chat Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: open ? '24px' : '-620px',
          right: '24px',
          width: '380px',
          height: '560px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 48px)',
          background: '#0a0a0a',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239, 68, 68, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(249, 115, 22, 0.04))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
              }}
            >
              <Shield size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                HIPAA Assistant
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                RocketOpp · 45 CFR §164 + 2026 NPRM
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: '8px',
                alignItems: 'flex-end',
              }}
            >
              {msg.role === 'assistant' && (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Shield size={11} color="#fff" strokeWidth={2.5} />
                </div>
              )}
              <div style={{ maxWidth: '78%' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius:
                      msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'rgba(255,255,255,0.05)',
                    color: msg.role === 'user' ? '#fff' : '#e5e5e5',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div
                    style={{
                      marginTop: '6px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    {msg.citations.map((c) => (
                      <span
                        key={c.rule}
                        title={c.title}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          fontFamily: 'ui-monospace, monospace',
                        }}
                      >
                        §{c.rule}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={11} color="#fff" strokeWidth={2.5} />
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'hipaa-pulse 1.2s infinite',
                  }}
                />
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'hipaa-pulse 1.2s infinite 0.2s',
                  }}
                />
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'hipaa-pulse 1.2s infinite 0.4s',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && !loading && (
          <div
            style={{
              padding: '0 16px 8px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {quickActions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  background: 'rgba(239, 68, 68, 0.06)',
                  color: '#fca5a5',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: '8px',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a HIPAA question..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#e5e5e5',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background:
                loading || !input.trim()
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Send size={16} color={loading || !input.trim() ? 'rgba(255,255,255,0.2)' : '#fff'} strokeWidth={2.5} />
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '6px 16px 8px',
            textAlign: 'center',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          Powered by{' '}
          <a
            href="https://0ncore.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
          >
            0nCore AI
          </a>{' '}
          · Cites 45 CFR §164 + 2026 NPRM
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open HIPAA assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: open
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #ef4444, #f97316)',
          border: open ? '1px solid rgba(255,255,255,0.1)' : 'none',
          boxShadow: open ? 'none' : '0 4px 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.08)',
          cursor: 'pointer',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          transition: 'all 0.2s ease',
        }}
      >
        <MessageCircle size={26} color="#fff" strokeWidth={2.2} />
      </button>

      <style>{`
        @keyframes hipaa-pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }
      `}</style>
    </>
  )
}
