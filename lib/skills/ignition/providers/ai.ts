// AI Provider for Ignition
// Handles Claude/OpenAI API calls for code generation

import Anthropic from '@anthropic-ai/sdk'

interface AIConfig {
  provider: 'anthropic' | 'openai'
  apiKey: string
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

/**
 * AI Provider for code/content generation
 */
export class AIProvider {
  private provider: 'anthropic' | 'openai'
  private apiKey: string
  private model: string

  constructor(config: AIConfig) {
    this.provider = config.provider
    this.apiKey = config.apiKey
    this.model = config.model || this.getDefaultModel()
  }

  private getDefaultModel(): string {
    switch (this.provider) {
      case 'anthropic':
        return 'claude-sonnet-4-20250514'
      case 'openai':
        return 'gpt-4-turbo-preview'
      default:
        return 'claude-sonnet-4-20250514'
    }
  }

  /**
   * Generate content using the AI
   */
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (this.provider === 'anthropic') {
      return this.generateWithAnthropic(options)
    } else {
      return this.generateWithOpenAI(options)
    }
  }

  /**
   * Generate using Claude
   */
  private async generateWithAnthropic(options: GenerateOptions): Promise<GenerateResult> {
    const anthropic = new Anthropic({
      apiKey: this.apiKey,
    })

    // Enhance system prompt for specific output formats
    let systemPrompt = options.systemPrompt || 'You are a helpful AI assistant.'

    if (options.outputFormat === 'json') {
      systemPrompt += '\n\nYou must respond with valid JSON only. No markdown, no explanations, just the JSON object.'
    } else if (options.outputFormat === 'code') {
      systemPrompt += '\n\nRespond with code only. No markdown code blocks, no explanations, just the raw code.'
    }

    const response = await anthropic.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: options.userPrompt,
        },
      ],
    })

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    return {
      content: this.cleanOutput(content, options.outputFormat),
      model: this.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  }

  /**
   * Generate using OpenAI (placeholder for future)
   */
  private async generateWithOpenAI(options: GenerateOptions): Promise<GenerateResult> {
    // OpenAI implementation would go here
    throw new Error('OpenAI provider not yet implemented')
  }

  /**
   * Clean output based on format
   */
  private cleanOutput(content: string, format?: string): string {
    let cleaned = content.trim()

    if (format === 'json') {
      // Remove any markdown code blocks
      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      // Try to parse and re-stringify for clean formatting
      try {
        const parsed = JSON.parse(cleaned)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return cleaned
      }
    }

    if (format === 'code') {
      // Remove markdown code blocks
      cleaned = cleaned
        .replace(/^```[\w]*\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
    }

    return cleaned
  }

  /**
   * Generate and parse JSON response
   */
  async generateJSON<T = any>(options: Omit<GenerateOptions, 'outputFormat'>): Promise<T> {
    const result = await this.generate({
      ...options,
      outputFormat: 'json',
    })

    try {
      return JSON.parse(result.content)
    } catch (err) {
      throw new Error(`Failed to parse AI response as JSON: ${err}`)
    }
  }

  /**
   * Generate code
   */
  async generateCode(options: Omit<GenerateOptions, 'outputFormat'>): Promise<string> {
    const result = await this.generate({
      ...options,
      outputFormat: 'code',
    })

    return result.content
  }

  /**
   * Generate multiple files at once
   */
  async generateFiles(
    systemPrompt: string,
    userPrompt: string,
    options?: { maxTokens?: number }
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

/**
 * Create AI provider from environment
 */
export function createAIProvider(provider: 'anthropic' | 'openai' = 'anthropic'): AIProvider {
  const apiKey = provider === 'anthropic'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()}_API_KEY environment variable is required`)
  }

  return new AIProvider({
    provider,
    apiKey,
  })
}

/**
 * Create AI provider from skill context
 */
export function createAIProviderFromContext(
  environment: Record<string, string>,
  provider: 'anthropic' | 'openai' = 'anthropic'
): AIProvider {
  const apiKey = provider === 'anthropic'
    ? environment.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
    : environment.OPENAI_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()}_API_KEY not found in context or environment`)
  }

  return new AIProvider({
    provider,
    apiKey,
    model: environment.AI_MODEL,
  })
}
