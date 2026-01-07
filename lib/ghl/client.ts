/**
 * GHL Client for RocketClients
 *
 * Uses environment variables for persistent connection - no OAuth needed.
 * Each RocketClient deployment connects to ONE GHL location.
 *
 * Required env vars:
 * - GHL_LOCATION_ID: The location ID
 * - GHL_LOCATION_PIT: Location Private Integration Token (for location-level APIs)
 * - GHL_AGENCY_PIT: Agency Private Integration Token (for agency-level APIs)
 * - GHL_COMPANY_ID: The agency/company ID
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

// Get credentials from env
function getCredentials() {
  return {
    locationId: process.env.GHL_LOCATION_ID!,
    locationPit: process.env.GHL_LOCATION_PIT!,
    agencyPit: process.env.GHL_AGENCY_PIT!,
    companyId: process.env.GHL_COMPANY_ID!,
  }
}

// Generic fetch wrapper
async function ghlFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: any
    useAgencyToken?: boolean
  } = {}
): Promise<T> {
  const { locationPit, agencyPit } = getCredentials()
  const token = options.useAgencyToken ? agencyPit : locationPit

  const res = await fetch(`${GHL_API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Version': GHL_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `GHL API error: ${res.status}`)
  }

  return res.json()
}

// ============================================
// CONTACTS
// ============================================

export interface GHLContact {
  id: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  tags?: string[]
  customFields?: Record<string, any>
  dateAdded?: string
  dateUpdated?: string
}

export const contacts = {
  async list(params?: { query?: string; limit?: number; skip?: number }) {
    const { locationId } = getCredentials()
    const searchParams = new URLSearchParams({ locationId })
    if (params?.query) searchParams.set('query', params.query)
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.skip) searchParams.set('skip', String(params.skip))

    return ghlFetch<{ contacts: GHLContact[]; total: number }>(
      `/contacts/?${searchParams}`
    )
  },

  async get(contactId: string) {
    return ghlFetch<{ contact: GHLContact }>(`/contacts/${contactId}`)
  },

  async create(data: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    tags?: string[]
    customFields?: { id: string; value: any }[]
  }) {
    const { locationId } = getCredentials()
    return ghlFetch<{ contact: GHLContact }>('/contacts/', {
      method: 'POST',
      body: { ...data, locationId },
    })
  },

  async update(contactId: string, data: Partial<GHLContact>) {
    return ghlFetch<{ contact: GHLContact }>(`/contacts/${contactId}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(contactId: string) {
    return ghlFetch<{ succeeded: boolean }>(`/contacts/${contactId}`, {
      method: 'DELETE',
    })
  },

  async addTags(contactId: string, tags: string[]) {
    return ghlFetch<{ tags: string[] }>(`/contacts/${contactId}/tags`, {
      method: 'POST',
      body: { tags },
    })
  },

  async removeTags(contactId: string, tags: string[]) {
    return ghlFetch<{ tags: string[] }>(`/contacts/${contactId}/tags`, {
      method: 'DELETE',
      body: { tags },
    })
  },
}

// ============================================
// CONVERSATIONS & MESSAGES
// ============================================

export interface GHLConversation {
  id: string
  contactId: string
  locationId: string
  lastMessageType?: string
  lastMessageDate?: string
  unreadCount?: number
}

export interface GHLMessage {
  id: string
  conversationId: string
  type: 'SMS' | 'Email' | 'WhatsApp' | 'GMB' | 'FB' | 'IG'
  direction: 'inbound' | 'outbound'
  body?: string
  dateAdded?: string
}

export const conversations = {
  async list(contactId: string) {
    const { locationId } = getCredentials()
    return ghlFetch<{ conversations: GHLConversation[] }>(
      `/conversations/search?locationId=${locationId}&contactId=${contactId}`
    )
  },

  async getMessages(conversationId: string) {
    return ghlFetch<{ messages: GHLMessage[] }>(
      `/conversations/${conversationId}/messages`
    )
  },

  async sendSMS(contactId: string, message: string) {
    return ghlFetch<{ messageId: string }>('/conversations/messages', {
      method: 'POST',
      body: {
        type: 'SMS',
        contactId,
        message,
      },
    })
  },

  async sendEmail(contactId: string, subject: string, html: string) {
    return ghlFetch<{ messageId: string }>('/conversations/messages', {
      method: 'POST',
      body: {
        type: 'Email',
        contactId,
        subject,
        html,
      },
    })
  },
}

// ============================================
// OPPORTUNITIES / PIPELINES
// ============================================

export interface GHLOpportunity {
  id: string
  name: string
  pipelineId: string
  pipelineStageId: string
  contactId: string
  status: 'open' | 'won' | 'lost' | 'abandoned'
  monetaryValue?: number
  dateAdded?: string
}

export interface GHLPipeline {
  id: string
  name: string
  stages: { id: string; name: string }[]
}

export const opportunities = {
  async list(params?: { pipelineId?: string; status?: string }) {
    const { locationId } = getCredentials()
    const searchParams = new URLSearchParams({ locationId })
    if (params?.pipelineId) searchParams.set('pipelineId', params.pipelineId)
    if (params?.status) searchParams.set('status', params.status)

    return ghlFetch<{ opportunities: GHLOpportunity[] }>(
      `/opportunities/search?${searchParams}`
    )
  },

  async get(opportunityId: string) {
    return ghlFetch<{ opportunity: GHLOpportunity }>(
      `/opportunities/${opportunityId}`
    )
  },

  async create(data: {
    pipelineId: string
    pipelineStageId: string
    contactId: string
    name: string
    status?: 'open' | 'won' | 'lost'
    monetaryValue?: number
  }) {
    const { locationId } = getCredentials()
    return ghlFetch<{ opportunity: GHLOpportunity }>('/opportunities/', {
      method: 'POST',
      body: { ...data, locationId },
    })
  },

  async update(opportunityId: string, data: Partial<GHLOpportunity>) {
    return ghlFetch<{ opportunity: GHLOpportunity }>(
      `/opportunities/${opportunityId}`,
      { method: 'PUT', body: data }
    )
  },

  async delete(opportunityId: string) {
    return ghlFetch<{ succeeded: boolean }>(`/opportunities/${opportunityId}`, {
      method: 'DELETE',
    })
  },
}

export const pipelines = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ pipelines: GHLPipeline[] }>(
      `/opportunities/pipelines?locationId=${locationId}`
    )
  },
}

// ============================================
// CALENDARS & APPOINTMENTS
// ============================================

export interface GHLCalendar {
  id: string
  name: string
  locationId: string
}

export interface GHLAppointment {
  id: string
  calendarId: string
  contactId: string
  title: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled' | 'showed' | 'noshow'
}

export const calendars = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ calendars: GHLCalendar[] }>(
      `/calendars/?locationId=${locationId}`
    )
  },

  async getAppointments(calendarId: string, startDate: string, endDate: string) {
    const { locationId } = getCredentials()
    return ghlFetch<{ events: GHLAppointment[] }>(
      `/calendars/events?locationId=${locationId}&calendarId=${calendarId}&startTime=${startDate}&endTime=${endDate}`
    )
  },

  async createAppointment(data: {
    calendarId: string
    contactId: string
    startTime: string
    endTime: string
    title?: string
  }) {
    const { locationId } = getCredentials()
    return ghlFetch<{ event: GHLAppointment }>('/calendars/events', {
      method: 'POST',
      body: { ...data, locationId },
    })
  },
}

// ============================================
// WORKFLOWS
// ============================================

export interface GHLWorkflow {
  id: string
  name: string
  status: 'draft' | 'published'
}

export const workflows = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ workflows: GHLWorkflow[] }>(
      `/workflows/?locationId=${locationId}`
    )
  },

  async addContact(workflowId: string, contactId: string) {
    return ghlFetch<{ success: boolean }>(
      `/workflows/${workflowId}/contacts/${contactId}`,
      { method: 'POST' }
    )
  },

  async removeContact(workflowId: string, contactId: string) {
    return ghlFetch<{ success: boolean }>(
      `/workflows/${workflowId}/contacts/${contactId}`,
      { method: 'DELETE' }
    )
  },
}

// ============================================
// LOCATION INFO
// ============================================

export interface GHLLocation {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  website?: string
  timezone?: string
  logoUrl?: string
}

export const location = {
  async get() {
    const { locationId } = getCredentials()
    return ghlFetch<{ location: GHLLocation }>(`/locations/${locationId}`)
  },

  async getCustomFields() {
    const { locationId } = getCredentials()
    return ghlFetch<{ customFields: { id: string; name: string; fieldKey: string }[] }>(
      `/locations/${locationId}/customFields`
    )
  },

  async getCustomValues() {
    const { locationId } = getCredentials()
    return ghlFetch<{ customValues: { id: string; name: string; value: string }[] }>(
      `/locations/${locationId}/customValues`
    )
  },

  async getTags() {
    const { locationId } = getCredentials()
    return ghlFetch<{ tags: { id: string; name: string }[] }>(
      `/locations/${locationId}/tags`
    )
  },
}

// ============================================
// USERS (Team members)
// ============================================

export interface GHLUser {
  id: string
  name: string
  email: string
  phone?: string
  role: string
}

export const users = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ users: GHLUser[] }>(`/users/?locationId=${locationId}`)
  },

  async get(userId: string) {
    return ghlFetch<{ user: GHLUser }>(`/users/${userId}`)
  },
}

// ============================================
// FORMS & SURVEYS
// ============================================

export const forms = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ forms: { id: string; name: string }[] }>(
      `/forms/?locationId=${locationId}`
    )
  },

  async getSubmissions(formId: string) {
    const { locationId } = getCredentials()
    return ghlFetch<{ submissions: any[] }>(
      `/forms/submissions?locationId=${locationId}&formId=${formId}`
    )
  },
}

export const surveys = {
  async list() {
    const { locationId } = getCredentials()
    return ghlFetch<{ surveys: { id: string; name: string }[] }>(
      `/surveys/?locationId=${locationId}`
    )
  },
}

// ============================================
// EXPORT ALL
// ============================================

export const ghl = {
  contacts,
  conversations,
  opportunities,
  pipelines,
  calendars,
  workflows,
  location,
  users,
  forms,
  surveys,
}

export default ghl
