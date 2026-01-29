// ============================================================
// RocketOpp GHL Webhook Helper
// ============================================================
// Centralized webhook for all form submissions
// ============================================================

// Main webhook for all RocketOpp leads
export const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/888494a8-27e2-4a7d-b3fc-e56243dc86be'

// Lead source identifiers
export const WebhookSources = {
  CONTACT_FORM: 'rocketopp-contact-form',
  INQUIRY_MODAL: 'rocketopp-inquiry-modal',
  ASSESSMENT: 'rocketopp-ai-assessment',
  REQUEST_APP: 'rocketopp-request-app',
  SUPPORT: 'rocketopp-support',
  GENERAL: 'rocketopp-website',
} as const

export type WebhookSource = typeof WebhookSources[keyof typeof WebhookSources]

export interface LeadData {
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  company?: string
  message?: string
  service?: string
  project?: string
  source: WebhookSource
  formName?: string
  pageUrl?: string
  tags?: string[]
  customFields?: Record<string, string | number | boolean>
}

/**
 * Send lead data to GHL webhook
 */
export async function sendToGHLWebhook(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      first_name: data.firstName || data.fullName?.split(' ')[0] || '',
      last_name: data.lastName || data.fullName?.split(' ').slice(1).join(' ') || '',
      full_name: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email,
      phone: data.phone || '',
      company_name: data.company || '',
      message: data.message || '',
      service_interested: data.service || '',
      project_description: data.project || '',
      source: data.source,
      form_name: data.formName || 'RocketOpp Website',
      page_url: data.pageUrl || 'https://rocketopp.com',
      tags: data.tags || ['Website Lead'],
      ...(data.customFields || {}),
      submitted_at: new Date().toISOString(),
    }

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('[GHL Webhook] Error:', response.status)
      return { success: false, error: `Webhook returned ${response.status}` }
    }

    console.log('[GHL Webhook] Successfully sent lead:', data.email)
    return { success: true }
  } catch (error) {
    console.error('[GHL Webhook] Failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
