// AI Provider for Ignition — migrated to canonical lib/ai-call SOP (Groq-only).
// API surface preserved so existing callers compile unchanged; the apiKey/provider
// fields are ignored at runtime — every call routes through askAI() which uses
// CRM Agent → Groq → heuristic fallback per the family-wide policy.

import { askAI, askAIForJson } from '@/lib/ai-call'

interface AIConfig {
  provider?: 'anthropic' | 'openai' | 'groq'
  apiKey?: string
  model?: string
}

interface GenerateOptions {
  systemPrompt?: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
  outputFormat?: 'text' | 'json' | 'code'
}

interface GenerateResult {
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

export class AIProvider {
  private model: string

  constructor(_config: AIConfig = {}) {
    this.model = 'llama-3.3-70b-versatile'
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    let systemPrompt = options.systemPrompt || 'You are a helpful AI assistant.'
    if (options.outputFormat === 'json') {
      systemPrompt += '\n\nYou must respond with valid JSON only. No markdown, no explanations, just the JSON object.'
    } else if (options.outputFormat === 'code') {
      systemPrompt += '\n\nRespond with code only. No markdown code blocks, no explanations, just the raw code.'
    }

    const prompt = `${systemPrompt}\n\n${options.userPrompt}`
    const { text } = await askAI(prompt, {
      maxTokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.4,
      json: options.outputFormat === 'json',
    })

    return {
      content: this.cleanOutput(text, options.outputFormat),
      model: this.model,
      usage: { inputTokens: 0, outputTokens: 0 },
    }
  }

  private cleanOutput(content: string, format?: string): string {
    let cleaned = content.trim()
    if (format === 'json') {
      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
      try {
        const parsed = JSON.parse(cleaned)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return cleaned
      }
    }
    if (format === 'code') {
      cleaned = cleaned
        .replace(/^```[\w]*\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
    }
    return cleaned
  }

  async generateJSON<T = unknown>(options: Omit<GenerateOptions, 'outputFormat'>): Promise<T> {
    const prompt = `${options.systemPrompt || 'You are a helpful AI assistant.'}\n\n${options.userPrompt}`
    const { data } = await askAIForJson<T>(prompt, {
      maxTokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.4,
    })
    if (data == null) throw new Error('Failed to parse AI response as JSON')
    return data
  }

  async generateCode(options: Omit<GenerateOptions, 'outputFormat'>): Promise<string> {
    const result = await this.generate({ ...options, outputFormat: 'code' })
    return result.content
  }

  async generateFiles(
    systemPrompt: string,
    userPrompt: string,
    options?: { maxTokens?: number },
  ): Promise<Array<{ path: string; content: string }>> {
    const result = await this.generateJSON<{ files: Array<{ path: string; content: string }> }>({
      systemPrompt: `${systemPrompt}

You must respond with a JSON object containing a "files" array. Each file should have:
- "path": The file path (e.g., "app/page.tsx")
- "content": The complete file content

Example response:
{
  "files": [
    { "path": "app/page.tsx", "content": "export default function Page() { ... }" },
    { "path": "app/layout.tsx", "content": "export default function Layout({ children }) { ... }" }
  ]
}`,
      userPrompt,
      maxTokens: options?.maxTokens || 8192,
    })
    return result.files || []
  }
}

export function createAIProvider(_provider: 'anthropic' | 'openai' | 'groq' = 'groq'): AIProvider {
  return new AIProvider()
}

export function createAIProviderFromContext(
  _environment: Record<string, string>,
  _provider: 'anthropic' | 'openai' | 'groq' = 'groq',
): AIProvider {
  return new AIProvider()
}
