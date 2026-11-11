'use client'

import { useEffect, useState } from 'react'
import s from './q60.module.css'

type Mode = 'buy' | 'offer' | 'question'
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function track(event: string, props: Record<string, unknown> = {}) {
  try { (window as unknown as { CRO9?: { track?: (e: string, p: unknown) => void } }).CRO9?.track?.(event, { page: 'q60-for-sale', ...props }) } catch {}
}

export function BuyPanel({ price, deposit }: { price: number; deposit: number }) {
  const [mode, setMode] = useState<Mode>('buy')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'fallback'>('idle')
  const [err, setErr] = useState('')
  const [cancelled, setCancelled] = useState(false)

  // Hero / sticky buttons link to #buy, #offer or #ask: open the matching tab.
  useEffect(() => {
    const pick = () => {
      const h = window.location.hash
      if (h === '#offer') setMode('offer')
      else if (h === '#ask') setMode('question')
      else if (h === '#buy') setMode('buy')
    }
    pick()
    setCancelled(new URLSearchParams(window.location.search).get('checkout') === 'cancelled')
    window.addEventListener('hashchange', pick)
    return () => window.removeEventListener('hashchange', pick)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(''); setState('sending')
    const body = Object.fromEntries(new FormData(e.currentTarget).entries())
    track('cro9_form_start', { formId: `q60-${mode}` })
    try {
      const r = await fetch(mode === 'buy' ? '/api/q60/buy' : '/api/q60/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, kind: mode }),
      })
      const j = await r.json()
      if (!j.ok) throw new Error(j.error || 'That did not go through. Email mike@rocketopp.com.')
      track('cro9_form_complete', { formId: `q60-${mode}`, offer: body.offer || null })
      if (mode === 'buy' && j.url) { window.location.href = j.url; return }
      setState(j.fallback ? 'fallback' : 'done')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Something went wrong.'); setState('idle')
    }
  }

  const tabs: [Mode, string][] = [['buy', `Buy it now · ${usd(price)}`], ['offer', 'Make an offer'], ['question', 'Ask a question']]

  return (
    <div className={s.panel}>
      <div className={s.panelTabs} role="tablist">
        {tabs.map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? s.ptOn : s.pt} onClick={() => { setMode(m); setState('idle'); setErr('') }}>{label}</button>
        ))}
      </div>

      {state === 'done' && (
        <div className={s.done}>
          <p className={s.doneHead}>{mode === 'offer' ? 'Offer sent.' : 'Question sent.'}</p>
          <p>It went straight to Mike. Expect a call or email the same day.</p>
        </div>
      )}
      {state === 'fallback' && (
        <div className={s.done}>
          <p className={s.doneHead}>The car is on hold for you.</p>
          <p>Mike has your details and will call you within a few hours to take the deposit and set a pickup time.</p>
        </div>
      )}

      {(state === 'idle' || state === 'sending') && (
        <form className={s.form} onSubmit={submit}>
          <input type="text" name="rk_hp" tabIndex={-1} autoComplete="off" className={s.hp} aria-hidden="true" />

          {mode === 'buy' && (
            <div className={s.terms}>
              {cancelled && <p className={s.note}>Checkout was cancelled. Nothing was charged; the form is still here.</p>}
              <p><strong>{usd(price)}, no haggling.</strong> Pay a {usd(deposit)} deposit by card now and the car is off the market. The deposit comes off the price; the {usd(price - deposit)} balance is paid when you pick it up, by cashier’s check or by wire that has cleared. Title and keys change hands then.</p>
              <p>If the car is not as described when you see it, your deposit is refunded in full.</p>
            </div>
          )}

          <div className={s.row2}>
            <label><span>Name</span><input name="name" required autoComplete="name" /></label>
            <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
          </div>
          <div className={s.row2}>
            <label><span>Phone {mode !== 'buy' && <small>optional</small>}</span><input name="phone" type="tel" autoComplete="tel" required={mode === 'buy'} /></label>
            {mode === 'offer' && <label><span>Your offer</span><input name="offer" inputMode="numeric" placeholder="$" required /></label>}
            {mode === 'buy' && <label><span>Pickup <small>when and from where</small></span><input name="pickup" placeholder="e.g. Saturday, driving from Columbus" /></label>}
          </div>

          {mode === 'offer' && (
            <div className={s.row2}>
              <label><span>Paying with</span>
                <select name="payment" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  <option>Cash or cashier’s check</option>
                  <option>Wire transfer</option>
                  <option>Bank or credit union financing</option>
                </select>
              </label>
              <label><span>Timeline</span>
                <select name="timeline" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  <option>This week</option>
                  <option>Within 2 weeks</option>
                  <option>This month</option>
                  <option>Just looking</option>
                </select>
              </label>
            </div>
          )}

          {mode !== 'buy' && (
            <label><span>{mode === 'offer' ? 'Anything Mike should know' : 'Your question'}</span>
              <textarea name="message" rows={4} required={mode === 'question'} placeholder={mode === 'offer' ? 'Where you are, when you could see it.' : 'Ask anything: history, the swap, the tune, inspection.'} />
            </label>
          )}

          {mode === 'buy' && (
            <label className={s.check}>
              <input type="checkbox" name="agree" required />
              <span>I am buying this car at {usd(price)}, as-is, on the terms above.</span>
            </label>
          )}

          {err && <p className={s.err} role="alert">{err}</p>}
          <button type="submit" className={s.submit} disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : mode === 'buy' ? `Pay ${usd(deposit)} deposit and hold the car` : mode === 'offer' ? 'Send my offer' : 'Send question'}
          </button>
          {mode === 'buy' && <p className={s.fine}>Card payment is processed by Stripe. You’ll get a receipt by email.</p>}
        </form>
      )}
    </div>
  )
}
