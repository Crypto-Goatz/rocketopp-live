/**
 * HIPAA Report Order — creates order, sends emails via CRM sub-location
 * POST /api/hipaa/order
 */

import { NextRequest, NextResponse } from 'next/server'

const CRM_API = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'
const CRM_PIT = process.env.CRM_PIT_ROCKETOPP || process.env.CRM_PIT || ''
const CRM_LOCATION = process.env.CRM_LOCATION_ID || '6MSqx0trfxgLxeHBJE1k'
const MIKE_EMAIL = 'mike@rocketopp.com'

interface ScanResult {
  publicUrl?: string
  currentRuleScore?: number
  nprm2026Score?: number
  currentGrade?: string
  nprmGrade?: string
  criticalFindings?: number
  highFindings?: number
  mediumFindings?: number
  passCount?: number
  failCount?: number
  publicChecks?: Array<{ id: string; name: string; status: string; detail: string; severity: string; ruleSection: string }>
  dashboardChecks?: Array<{ id: string; name: string; status: string; detail: string; severity: string; ruleSection: string }>
  remediationPriority?: Array<{ priority: number; name: string; effort: string; impact: string }>
}

async function crmSendEmail(to: string, subject: string, html: string) {
  const res = await fetch(`${CRM_API}/conversations/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRM_PIT}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Email',
      locationId: CRM_LOCATION,
      contactId: '', // Will create contact first
      subject,
      html,
      emailTo: to,
    }),
  })
  return res
}

async function crmCreateContact(email: string, tags: string[]) {
  const res = await fetch(`${CRM_API}/contacts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRM_PIT}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId: CRM_LOCATION,
      email,
      tags,
      source: 'HIPAA Scanner — rocketopp.com',
    }),
  })
  if (res.ok) {
    const data = await res.json()
    return data.contact?.id || null
  }
  return null
}

async function crmSendEmailToContact(contactId: string, subject: string, html: string) {
  const res = await fetch(`${CRM_API}/conversations/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRM_PIT}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Email',
      locationId: CRM_LOCATION,
      contactId,
      subject,
      html,
    }),
  })
  return res.ok
}

function buildCustomerEmail(orderId: string, publicUrl: string, scan: ScanResult): string {
  const checks = [...(scan.publicChecks || []), ...(scan.dashboardChecks || [])]
  const failed = checks.filter(c => c.status === 'fail').slice(0, 10)

  const findingsRows = failed.map(c => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #1e293b;font-size:12px;font-weight:600;color:#f0f4f8;">${c.name}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #1e293b;font-size:11px;color:#ef4444;">FAIL</td>
      <td style="padding:6px 10px;border-bottom:1px solid #1e293b;font-size:11px;color:#9ca3af;">${c.detail.slice(0, 100)}</td>
    </tr>
  `).join('')

  return `
<div style="font-family:Inter,system-ui,sans-serif;background:#0d1117;color:#f0f4f8;padding:32px;max-width:640px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:24px;">
    <img src="https://0ncore.com/brand/0ncore-icon.png" alt="" width="32" height="32" style="border-radius:8px;" />
  </div>

  <h2 style="color:#6EE05A;margin:0 0 8px;text-align:center;">HIPAA Compliance Report — Order Confirmed</h2>
  <p style="text-align:center;color:#9ca3af;font-size:13px;">Order ${orderId} for ${publicUrl}</p>

  <div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
    <table style="width:100%;"><tr>
      <td style="text-align:center;padding:12px;">
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">Current Rule</div>
        <div style="font-size:36px;font-weight:800;color:${scan.currentGrade === 'F' ? '#ef4444' : '#f59e0b'};">${scan.currentGrade}</div>
        <div style="font-size:14px;color:#9ca3af;">${scan.currentRuleScore}/100</div>
      </td>
      <td style="text-align:center;padding:12px;">
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">2026 NPRM</div>
        <div style="font-size:36px;font-weight:800;color:${scan.nprmGrade === 'F' ? '#ef4444' : '#f59e0b'};">${scan.nprmGrade}</div>
        <div style="font-size:14px;color:#9ca3af;">${scan.nprm2026Score}/100</div>
      </td>
    </tr></table>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
      <span style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:6px;padding:4px 10px;font-size:11px;color:#ef4444;font-weight:600;">${scan.criticalFindings} Critical</span>
      <span style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:6px;padding:4px 10px;font-size:11px;color:#f97316;font-weight:600;">${scan.highFindings} High</span>
      <span style="background:rgba(110,224,90,0.1);border:1px solid rgba(110,224,90,0.2);border-radius:6px;padding:4px 10px;font-size:11px;color:#6EE05A;font-weight:600;">${scan.passCount} Passed</span>
    </div>
  </div>

  <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;">Top Findings (Summary)</h3>
  <p style="font-size:11px;color:#9ca3af;margin-bottom:12px;">These are the most critical issues found. Your full report will include all 63 checks with detailed remediation.</p>
  <table style="width:100%;border-collapse:collapse;background:#161b22;border-radius:8px;overflow:hidden;margin-bottom:24px;">
    <thead><tr style="background:#1c2333;">
      <th style="text-align:left;padding:8px 10px;font-size:10px;color:#6b7280;text-transform:uppercase;">Finding</th>
      <th style="text-align:left;padding:8px 10px;font-size:10px;color:#6b7280;text-transform:uppercase;">Status</th>
      <th style="text-align:left;padding:8px 10px;font-size:10px;color:#6b7280;text-transform:uppercase;">Detail</th>
    </tr></thead>
    <tbody>${findingsRows}</tbody>
  </table>

  <div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:20px;text-align:center;">
    <h3 style="font-size:14px;margin:0 0 8px;">What happens next?</h3>
    <ol style="text-align:left;color:#9ca3af;font-size:12px;line-height:2;padding-left:20px;margin:0;">
      <li>This email is your scan summary — save it for reference</li>
      <li>Our team is preparing your <strong style="color:#f0f4f8;">full detailed report</strong></li>
      <li>You will receive the complete report within <strong style="color:#f0f4f8;">60 minutes</strong></li>
      <li>The full report includes all 63 checks, remediation steps, and a prioritized action plan</li>
    </ol>
  </div>

  <p style="color:#6b7280;font-size:11px;margin-top:24px;text-align:center;">
    Questions? Reply to this email or contact <a href="mailto:mike@rocketopp.com" style="color:#6EE05A;">mike@rocketopp.com</a>
  </p>
  <div style="text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;">
    <span style="font-size:10px;color:#4b5563;">RocketOpp LLC — Powered by 0nCore AI Tools</span>
  </div>
</div>`
}

export async function POST(req: NextRequest) {
  try {
    const { email, publicUrl, dashboardUrl, scanResult } = await req.json()

    if (!email || !publicUrl || !scanResult) {
      return NextResponse.json({ error: 'email, publicUrl, and scanResult required' }, { status: 400 })
    }

    const orderId = `HIPAA-${Date.now().toString(36).toUpperCase()}`

    // 1. Create CRM contact (or find existing) with HIPAA tags
    const contactId = await crmCreateContact(email, [
      'hipaa-scan',
      `hipaa-grade-${(scanResult.currentGrade || 'F').toLowerCase()}`,
      'hipaa-report-ordered',
      'source-rocketopp',
    ])

    // 2. Send confirmation email to customer via CRM
    if (contactId) {
      const customerHtml = buildCustomerEmail(orderId, publicUrl, scanResult)
      await crmSendEmailToContact(contactId, `Your HIPAA Compliance Report — Order ${orderId}`, customerHtml)
    }

    // 3. Notify Mike via CRM (internal notification)
    // Find or use Mike's contact ID
    try {
      const mikeSearch = await fetch(`${CRM_API}/contacts/search/duplicate?locationId=${CRM_LOCATION}&email=${encodeURIComponent(MIKE_EMAIL)}`, {
        headers: { Authorization: `Bearer ${CRM_PIT}`, Version: CRM_VERSION },
      })
      if (mikeSearch.ok) {
        const mikeData = await mikeSearch.json()
        const mikeContactId = mikeData.contact?.id
        if (mikeContactId) {
          await crmSendEmailToContact(mikeContactId,
            `New HIPAA Report Order — ${publicUrl}`,
            `<div style="font-family:Inter,sans-serif;background:#0d1117;color:#f0f4f8;padding:24px;">
              <h2 style="color:#6EE05A;">New HIPAA Report Order</h2>
              <p><strong>Order:</strong> ${orderId}</p>
              <p><strong>Customer:</strong> ${email}</p>
              <p><strong>URL:</strong> ${publicUrl}</p>
              <p><strong>Dashboard:</strong> ${dashboardUrl || publicUrl}</p>
              <p><strong>Score:</strong> ${scanResult.currentGrade} (${scanResult.currentRuleScore}/100) | NPRM: ${scanResult.nprmGrade} (${scanResult.nprm2026Score}/100)</p>
              <p><strong>Critical:</strong> ${scanResult.criticalFindings} | <strong>High:</strong> ${scanResult.highFindings}</p>
              <hr style="border-color:#30363d;"/>
              <p style="color:#9ca3af;font-size:12px;">Deliver full report to ${email} within 60 minutes.</p>
            </div>`
          )
        }
      }
    } catch {
      // Non-critical — just log
    }

    console.log(`[HIPAA Order] ${orderId} | ${email} | ${publicUrl} | ${scanResult.currentGrade}/${scanResult.nprmGrade} | Contact: ${contactId}`)

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error('HIPAA order error:', error)
    return NextResponse.json({ error: 'Order failed' }, { status: 500 })
  }
}
