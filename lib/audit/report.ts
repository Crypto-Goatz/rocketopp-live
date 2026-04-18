import type { AuditReport, Finding } from './types'

const GRADE_COLORS: Record<AuditReport['grade'], string> = {
  A: '#16a34a', B: '#65a30d', C: '#eab308', D: '#f97316', F: '#dc2626',
}

const SEV_COLORS: Record<Finding['severity'], string> = {
  critical: '#dc2626', high: '#ea580c', medium: '#eab308', low: '#6b7280', positive: '#16a34a',
}
const SEV_LABELS: Record<Finding['severity'], string> = {
  critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW', positive: 'POSITIVE',
}

function sevBadge(s: Finding['severity']) {
  return `<span style="display:inline-block;padding:3px 8px;border-radius:4px;background:${SEV_COLORS[s]};color:#fff;font-size:10px;font-weight:700;letter-spacing:0.08em;">${SEV_LABELS[s]}</span>`
}

function findingRow(f: Finding): string {
  return `
    <div style="padding:14px 16px;border:1px solid #eee;border-radius:8px;margin-bottom:10px;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <strong style="color:#111;font-size:15px;">${f.id} — ${escapeHtml(f.title)}</strong>
        ${sevBadge(f.severity)}
      </div>
      <div style="color:#555;font-size:13px;line-height:1.5;">${escapeHtml(f.evidence)}</div>
    </div>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c] as string)
}

function countsTable(findings: Finding[]): string {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, positive: 0 }
  for (const f of findings) counts[f.severity]++
  const row = (label: string, sev: Finding['severity']) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:${SEV_COLORS[sev]};">${counts[sev]}</td></tr>`
  return `
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;background:#fff;">
      ${row('Critical', 'critical')}
      ${row('High', 'high')}
      ${row('Medium', 'medium')}
      ${row('Low', 'low')}
      ${row('Positive', 'positive')}
    </table>`
}

function stackTable(stack: AuditReport['stack']): string {
  const rows = Object.entries(stack).filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;text-transform:capitalize;">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">${escapeHtml(v)}</td></tr>`
  ).join('')
  if (!rows) return '<p style="color:#666;font-size:14px;">Stack fingerprint not collected.</p>'
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;background:#fff;">${rows}</table>`
}

export function renderAuditEmail(report: AuditReport): { subject: string; html: string; text: string } {
  const gradeColor = GRADE_COLORS[report.grade]
  const findingsBySev: Finding[] = [...report.findings].sort((a, b) => {
    const order: Record<Finding['severity'], number> = { critical: 0, high: 1, medium: 2, low: 3, positive: 4 }
    return order[a.severity] - order[b.severity]
  })
  const topHosts = report.hosts.slice(0, 10)
    .map((h) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;">${escapeHtml(h.name)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;color:#666;">${escapeHtml(h.ip || '')}</td></tr>`)
    .join('')

  const pathsRows = report.exposedPaths.slice(0, 12)
    .map((p) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;">${p.status}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;">${escapeHtml(p.path)}</td></tr>`)
    .join('')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;">
  <tr><td align="center" style="padding:24px 12px;">
    <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <tr><td style="background:linear-gradient(135deg,#ff6b35 0%,#ff3b00 100%);padding:36px 36px 28px;color:#fff;">
        <div style="font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;opacity:0.9;">CRO9 Stack Health Report</div>
        <div style="font-size:28px;font-weight:700;margin-top:6px;letter-spacing:-0.02em;">${escapeHtml(report.target)}</div>
        <div style="opacity:0.85;font-size:13px;margin-top:4px;">Audited ${new Date(report.auditDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
      </td></tr>

      <tr><td style="padding:28px 36px;background:#fafafa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #eee;border-radius:10px;">
          <tr>
            <td style="padding:28px 32px;text-align:center;border-right:1px solid #eee;width:45%;">
              <div style="font-size:72px;font-weight:800;color:${gradeColor};line-height:1;">${report.grade}</div>
              <div style="font-size:14px;color:#666;margin-top:6px;">Grade</div>
            </td>
            <td style="padding:28px 32px;text-align:center;">
              <div style="font-size:56px;font-weight:800;color:#111;line-height:1;">${report.score}<span style="font-size:22px;color:#999;">/100</span></div>
              <div style="font-size:14px;color:#666;margin-top:6px;">Score</div>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:8px 36px 20px;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:20px 0 10px;letter-spacing:-0.01em;">Executive Summary</h2>
        <p style="font-size:15px;line-height:1.65;color:#333;margin:0;">${escapeHtml(report.executiveSummary)}</p>
      </td></tr>

      <tr><td style="padding:8px 36px 0;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:20px 0 10px;letter-spacing:-0.01em;">Finding Counts</h2>
        ${countsTable(report.findings)}
      </td></tr>

      ${report.findings.length ? `
      <tr><td style="padding:8px 36px;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:24px 0 12px;letter-spacing:-0.01em;">Findings</h2>
        ${findingsBySev.map(findingRow).join('')}
      </td></tr>
      ` : ''}

      ${Object.values(report.stack).some(Boolean) ? `
      <tr><td style="padding:8px 36px;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:24px 0 12px;letter-spacing:-0.01em;">Detected Stack</h2>
        ${stackTable(report.stack)}
      </td></tr>
      ` : ''}

      ${topHosts ? `
      <tr><td style="padding:8px 36px;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:24px 0 12px;letter-spacing:-0.01em;">Infrastructure Map (top ${Math.min(10, report.hosts.length)})</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;font-size:13px;background:#fff;">${topHosts}</table>
      </td></tr>
      ` : ''}

      ${pathsRows ? `
      <tr><td style="padding:8px 36px;">
        <h2 style="font-size:15px;font-weight:600;color:#111;margin:24px 0 12px;letter-spacing:-0.01em;">Exposed Paths</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;font-size:13px;background:#fff;">${pathsRows}</table>
      </td></tr>
      ` : ''}

      <tr><td style="padding:28px 36px 36px;background:#fafafa;border-top:1px solid #eee;">
        <div style="background:linear-gradient(135deg,#ff6b35 0%,#ff3b00 100%);padding:24px;border-radius:10px;color:#fff;">
          <div style="font-size:18px;font-weight:700;margin-bottom:6px;">Want us to fix it?</div>
          <div style="font-size:14px;opacity:0.9;margin-bottom:16px;">We rebuild broken stacks cleanly — modern framework, proper headers, CI/CD, full CRM integration. Fixed price, no proposals.</div>
          <a href="https://rocketopp.com/contact" style="display:inline-block;background:#fff;color:#ff3b00;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Book a scoping call →</a>
        </div>
      </td></tr>

      <tr><td style="padding:18px 36px 24px;text-align:center;color:#999;font-size:12px;">
        RocketOpp · CRO9 Stack Health · <a href="https://rocketopp.com" style="color:#999;">rocketopp.com</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`

  const text = [
    `CRO9 Stack Health Report — ${report.target}`,
    `Grade: ${report.grade} (${report.score}/100)`,
    '',
    report.executiveSummary,
    '',
    'Findings:',
    ...report.findings.map((f) => `  [${SEV_LABELS[f.severity]}] ${f.id} — ${f.title}\n    ${f.evidence}`),
    '',
    `Full breakdown at https://rocketopp.com`,
  ].join('\n')

  return {
    subject: `[CRO9] ${report.target} — Grade ${report.grade} (${report.score}/100)`,
    html,
    text,
  }
}
