#!/usr/bin/env npx ts-node
/**
 * Sync environment variables to Vercel
 *
 * Usage:
 *   npx ts-node scripts/sync-env.ts
 *   npx ts-node scripts/sync-env.ts --env .env.production --target production
 *   npx ts-node scripts/sync-env.ts --project rocketopp-live --dry-run
 *
 * Requires VERCEL_TOKEN env var or ~/.vercel-token file
 */

import fs from 'fs'
import path from 'path'
import https from 'https'

// Config
const DEFAULT_ENV_FILE = '.env.local'
const DEFAULT_PROJECT = 'rocketopp-live'
const DEFAULT_TARGET = 'production' // production, preview, development

// Parse args
const args = process.argv.slice(2)
const getArg = (name: string, defaultValue: string) => {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue
}
const hasFlag = (name: string) => args.includes(`--${name}`)

const envFile = getArg('env', DEFAULT_ENV_FILE)
const project = getArg('project', DEFAULT_PROJECT)
const target = getArg('target', DEFAULT_TARGET)
const dryRun = hasFlag('dry-run')
const verbose = hasFlag('verbose')

// Colors
const colors = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
}

// Get token
function getToken(): string {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN

  const tokenFile = path.join(process.env.HOME || '', '.vercel-token')
  if (fs.existsSync(tokenFile)) {
    return fs.readFileSync(tokenFile, 'utf-8').trim()
  }

  console.error(colors.red('Error: No Vercel token found'))
  console.log('')
  console.log('To get a token:')
  console.log('1. Go to https://vercel.com/account/tokens')
  console.log('2. Create a new token with full access')
  console.log('3. Save it:')
  console.log(colors.cyan('   echo "your-token" > ~/.vercel-token && chmod 600 ~/.vercel-token'))
  console.log('')
  console.log('Or set the VERCEL_TOKEN environment variable')
  process.exit(1)
}

// Parse env file
function parseEnvFile(filePath: string): Map<string, string> {
  if (!fs.existsSync(filePath)) {
    console.error(colors.red(`Error: ${filePath} not found`))
    process.exit(1)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const vars = new Map<string, string>()

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (key) vars.set(key, value)
  }

  return vars
}

// Vercel API helper
function vercelApi<T>(method: string, endpoint: string, body?: object): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const data = body ? JSON.stringify(body) : undefined

    const options = {
      hostname: 'api.vercel.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => responseData += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData)
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(json.error?.message || `HTTP ${res.statusCode}`))
          } else {
            resolve(json)
          }
        } catch {
          reject(new Error(`Invalid JSON response: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

// Get existing env vars
async function getExistingVars(projectId: string): Promise<Map<string, { id: string; value: string }>> {
  const result = await vercelApi<{ envs: { id: string; key: string; value: string }[] }>(
    'GET',
    `/v9/projects/${projectId}/env`
  )

  const vars = new Map<string, { id: string; value: string }>()
  for (const env of result.envs || []) {
    vars.set(env.key, { id: env.id, value: env.value })
  }
  return vars
}

// Main
async function main() {
  console.log('')
  console.log(colors.cyan(`Syncing ${envFile} → Vercel (${project})`))
  console.log(colors.dim(`Target: ${target}${dryRun ? ' [DRY RUN]' : ''}`))
  console.log('')

  const localVars = parseEnvFile(envFile)
  console.log(`Found ${localVars.size} variables in ${envFile}`)

  // Get existing vars
  console.log('Fetching existing Vercel env vars...')
  const existingVars = await getExistingVars(project)
  console.log(`Found ${existingVars.size} existing variables`)
  console.log('')

  let added = 0, updated = 0, skipped = 0, failed = 0

  for (const [key, value] of localVars) {
    const existing = existingVars.get(key)
    const maskedValue = value.length > 8 ? value.slice(0, 4) + '...' + value.slice(-4) : '****'

    try {
      if (existing) {
        // Update existing
        if (dryRun) {
          console.log(colors.yellow(`[UPDATE] ${key} = ${maskedValue}`))
          updated++
        } else {
          await vercelApi('PATCH', `/v9/projects/${project}/env/${existing.id}`, {
            value,
            target: [target],
          })
          console.log(colors.yellow(`[UPDATE] ${key}`))
          updated++
        }
      } else {
        // Create new
        if (dryRun) {
          console.log(colors.green(`[ADD] ${key} = ${maskedValue}`))
          added++
        } else {
          await vercelApi('POST', `/v10/projects/${project}/env`, {
            key,
            value,
            type: 'encrypted',
            target: [target],
          })
          console.log(colors.green(`[ADD] ${key}`))
          added++
        }
      }
    } catch (error: any) {
      console.log(colors.red(`[FAIL] ${key}: ${error.message}`))
      failed++
    }
  }

  console.log('')
  console.log('─'.repeat(40))
  console.log(`${colors.green(`Added: ${added}`)}  ${colors.yellow(`Updated: ${updated}`)}  ${colors.red(`Failed: ${failed}`)}`)

  if (dryRun) {
    console.log('')
    console.log(colors.dim('This was a dry run. Remove --dry-run to apply changes.'))
  } else if (added > 0 || updated > 0) {
    console.log('')
    console.log('Redeploy to apply changes:')
    console.log(colors.cyan(`  vercel deploy --prod`))
  }
  console.log('')
}

main().catch((err) => {
  console.error(colors.red(`Error: ${err.message}`))
  process.exit(1)
})
