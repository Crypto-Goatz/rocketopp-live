// ============================================================
// Backward-compat shim — delegates to lib/crm/notify (0nCore pattern)
// ============================================================
// This file is kept so existing handlers don't break. New code should
// import from '@/lib/crm/notify' directly.
// ============================================================

import {
  notifyFormSubmission,
  FormSources,
  type FormSubmission,
  type NotifyResult,
} from '@/lib/crm/notify'

export const WebhookSources = FormSources
export type WebhookSource = typeof FormSources[keyof typeof FormSources]

// Kept for any callers that still reference it
export const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/888494a8-27e2-4a7d-b3fc-e56243dc86be'

export type LeadData = FormSubmission

/**
 * @deprecated Use notifyFormSubmission from '@/lib/crm/notify'.
 * Kept for backward compatibility — now performs contact upsert AND direct
 * email to Mike in addition to the legacy webhook fire.
 */
export async function sendToGHLWebhook(
  data: LeadData
): Promise<{ success: boolean; error?: string; result?: NotifyResult }> {
  const result = await notifyFormSubmission(data)
  if (!result.success) {
    return { success: false, error: 'All notification paths failed', result }
  }
  return { success: true, result }
}
