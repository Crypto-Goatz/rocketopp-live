/**
 * AI Readiness report → PDF, and PDF → CRM document.
 *
 * Runs server-side inside the scan's waitUntil() fulfillment, so it must never
 * throw in a way that kills the rest of the sequence (CRM upsert, email). Every
 * function here returns null on failure and logs, rather than raising.
 */

import { jsPDF } from 'jspdf'

const CRM_BASE = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'

export interface ReportForPdf {
  score: number
  summary: string
  priorities: { title: string; why: string }[]
  recommendations: string[]
}

const ORANGE: [number, number, number] = [255, 107, 53]
const INK: [number, number, number] = [17, 17, 17]
const MUTED: [number, number, number] = [110, 110, 110]

/**
 * Renders the report as a branded PDF and returns it as a Buffer.
 * Pure jsPDF — no headless browser, so it runs inside a serverless function.
 */
export function buildReportPdf(opts: {
  domain: string
  report: ReportForPdf
  scanId: string
  generatedAt?: Date
}): Buffer | null {
  try {
    const { domain, report, scanId } = opts
    const generatedAt = opts.generatedAt || new Date()

    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    const M = 48
    const CONTENT = W - M * 2
    let y = 0

    // ── Header band ──────────────────────────────────────────────────────
    doc.setFillColor(...ORANGE)
    doc.rect(0, 0, W, 92, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('AI Readiness Report', M, 46)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(domain, M, 68)
    doc.setFontSize(9)
    doc.text('RocketOpp · rocketopp.com', W - M, 68, { align: 'right' })
    y = 130

    // ── Score ────────────────────────────────────────────────────────────
    const score = Math.max(0, Math.min(100, Math.round(report.score ?? 0)))
    doc.setTextColor(...INK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(46)
    doc.text(String(score), M, y)
    doc.setFontSize(12)
    doc.setTextColor(...MUTED)
    doc.text('/ 100', M + 62, y)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...INK)
    doc.text('AI search readiness score', M + 110, y - 16)

    // Score bar
    const barY = y + 14
    doc.setFillColor(235, 235, 235)
    doc.rect(M, barY, CONTENT, 8, 'F')
    doc.setFillColor(...ORANGE)
    doc.rect(M, barY, (CONTENT * score) / 100, 8, 'F')
    y = barY + 44

    // ── Summary ──────────────────────────────────────────────────────────
    if (report.summary) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(...INK)
      doc.text('Summary', M, y)
      y += 18
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.setTextColor(60, 60, 60)
      const lines = doc.splitTextToSize(report.summary, CONTENT)
      doc.text(lines, M, y)
      y += lines.length * 14 + 22
    }

    const pageBreak = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 70) {
        doc.addPage()
        y = 70
      }
    }

    // ── Priorities ───────────────────────────────────────────────────────
    if (report.priorities?.length) {
      pageBreak(60)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(...INK)
      doc.text('Top priorities', M, y)
      y += 20

      report.priorities.forEach((p, i) => {
        pageBreak(70)
        doc.setFillColor(...ORANGE)
        doc.circle(M + 7, y - 4, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(String(i + 1), M + 7, y - 1, { align: 'center' })

        doc.setTextColor(...INK)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        const t = doc.splitTextToSize(p.title || '', CONTENT - 28)
        doc.text(t, M + 26, y)
        y += t.length * 14 + 2

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(90, 90, 90)
        const wy = doc.splitTextToSize(p.why || '', CONTENT - 28)
        doc.text(wy, M + 26, y)
        y += wy.length * 13 + 16
      })
      y += 6
    }

    // ── Recommendations ──────────────────────────────────────────────────
    if (report.recommendations?.length) {
      pageBreak(60)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(...INK)
      doc.text('Recommended fixes', M, y)
      y += 20
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      report.recommendations.forEach((r) => {
        pageBreak(30)
        doc.setTextColor(...ORANGE)
        doc.text('•', M, y)
        doc.setTextColor(60, 60, 60)
        const lines = doc.splitTextToSize(r, CONTENT - 16)
        doc.text(lines, M + 14, y)
        y += lines.length * 14 + 6
      })
    }

    // ── Footer on every page ─────────────────────────────────────────────
    const pages = doc.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      const H = doc.internal.pageSize.getHeight()
      doc.setDrawColor(230, 230, 230)
      doc.line(M, H - 52, W - M, H - 52)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...MUTED)
      doc.text(
        `Generated ${generatedAt.toISOString().slice(0, 10)} · scan ${scanId.slice(0, 8)} · rocketopp.com`,
        M,
        H - 34,
      )
      doc.text(`${i} / ${pages}`, W - M, H - 34, { align: 'right' })
    }

    return Buffer.from(doc.output('arraybuffer'))
  } catch (e) {
    console.error('[ai-readiness/pdf] build failed:', e)
    return null
  }
}

/**
 * Uploads the PDF into the CRM media library and returns its public URL.
 *
 * The CRM has no "attach a file directly to a contact" endpoint, so the durable
 * pattern is: upload to the media library, then write the resulting URL onto the
 * contact as a custom field (done by the caller). That gives a real document in
 * the CRM plus a link on the contact record.
 */
export async function uploadPdfToCrm(opts: {
  pdf: Buffer
  filename: string
  locationId: string
  pit: string
}): Promise<string | null> {
  const { pdf, filename, locationId, pit } = opts
  try {
    const form = new FormData()
    form.append('file', new Blob([new Uint8Array(pdf)], { type: 'application/pdf' }), filename)
    form.append('name', filename)
    // Some tenants require the location on the body as well as the query.
    form.append('locationId', locationId)

    const res = await fetch(
      `${CRM_BASE}/medias/upload-file?altType=location&altId=${encodeURIComponent(locationId)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pit}`,
          Version: CRM_VERSION,
          // Content-Type intentionally omitted — fetch sets the multipart boundary.
        },
        body: form,
      },
    )

    const text = await res.text()
    if (!res.ok) {
      console.error('[ai-readiness/pdf] CRM upload failed', res.status, text.slice(0, 300))
      return null
    }

    let data: Record<string, unknown> = {}
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[ai-readiness/pdf] CRM upload returned non-JSON:', text.slice(0, 200))
      return null
    }

    const url =
      (data.url as string) ||
      (data.fileUrl as string) ||
      ((data.file as Record<string, unknown>)?.url as string) ||
      ((data.data as Record<string, unknown>)?.url as string) ||
      null

    if (!url) {
      console.error('[ai-readiness/pdf] CRM upload gave no URL:', JSON.stringify(data).slice(0, 300))
      return null
    }
    return url
  } catch (e) {
    console.error('[ai-readiness/pdf] CRM upload threw:', e)
    return null
  }
}
