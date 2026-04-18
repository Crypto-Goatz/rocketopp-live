export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'positive'

export interface Finding {
  id: string
  severity: Severity
  title: string
  evidence: string
  phase: number
}

export interface Host {
  name: string
  ip?: string
  platform?: string
  status?: number
}

export interface CertInfo {
  hostname: string
  valid: boolean
  issuer?: string
  subject?: string
  validFrom?: string
  validTo?: string
  daysRemaining?: number
  error?: string
}

export interface AuditReport {
  target: string
  auditDate: string
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  score: number
  findings: Finding[]
  hosts: Host[]
  certs: CertInfo[]
  stack: Record<string, string>
  missingHeaders: string[]
  exposedPaths: Array<{ path: string; status: number; size: number }>
  assetAges: Array<{ path: string; lastModified?: string; ageDays?: number }>
  executiveSummary: string
}

export type TestCategory =
  | 'infrastructure'
  | 'tls'
  | 'headers'
  | 'stack'
  | 'paths'
  | 'assets'
