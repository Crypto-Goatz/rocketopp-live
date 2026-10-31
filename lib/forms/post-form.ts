/**
 * One way for every form on rocketopp.com to send a submission.
 *
 * WHY: forms used to each roll their own fetch. Several had no timeout (a hung
 * request left the visitor on a spinner forever), several ignored a non-2xx
 * answer and showed nothing, and a few showed "success" whether or not anything
 * arrived. This helper gives every form the same three guarantees:
 *   1. it never hangs: the request aborts after `timeoutMs` (default 25 s),
 *   2. a failed or non-2xx answer always throws a FormSendError,
 *   3. the error message always ends with a human way to reach us.
 *
 * Client-safe: no server imports.
 */

export const FORM_PHONE = '(878) 888-1230'
export const FORM_PHONE_HREF = 'tel:+18788881230'
export const FORM_EMAIL = 'mike@rocketopp.com'
export const FORM_FALLBACK = `please call ${FORM_PHONE} or email ${FORM_EMAIL} and we'll take it from there`

export class FormSendError extends Error {
  status: number | null
  data: Record<string, unknown>
  constructor(message: string, status: number | null = null, data: Record<string, unknown> = {}) {
    super(message)
    this.name = 'FormSendError'
    this.status = status
    this.data = data
  }
}

/** API error codes like "name_and_email_required" are not sentences; keep only readable messages. */
function readable(msg: unknown): string | null {
  if (typeof msg !== 'string' || !msg.trim()) return null
  if (/^[a-z0-9_:-]+$/.test(msg.trim())) return null
  return msg.trim().replace(/[.!]+$/, '')
}

export async function postForm<T = Record<string, unknown>>(
  url: string,
  body: unknown,
  { timeoutMs = 25_000 }: { timeoutMs?: number } = {},
): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new FormSendError('That took too long to send')
    }
    throw new FormSendError("We couldn't reach our server")
  }
  clearTimeout(timer)

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok || data?.ok === false || data?.success === false) {
    throw new FormSendError(
      readable(data?.error) || readable(data?.message) || `Something went wrong sending that (error ${res.status})`,
      res.status,
      data,
    )
  }
  return data as T
}

/** The sentence a form shows when sending failed: what happened, then how to reach a person. */
export function formErrorMessage(err: unknown): string {
  const msg = err instanceof FormSendError ? err.message : "Something went wrong sending that"
  return `${msg} — ${FORM_FALLBACK}.`
}
