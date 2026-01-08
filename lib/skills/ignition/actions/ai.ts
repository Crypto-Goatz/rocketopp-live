// Ignition AI Action Handler
// Handles ai:generate, ai:analyze, ai:transform operations

import {
  ActionConfig,
  ActionResult,
  ExecutionContext,
  AIActionConfig,
} from '../types'
import { resolveTemplate, setContextVariable } from '../context'
import { createErrorResult, createSuccessResult } from './registry'
import { createAIProviderFromContext, AIProvider } from '../providers/ai'

/**
 * Main AI action handler
 */
export async function aiHandler(
  context: ExecutionContext,
  config: ActionConfig
): Promise<ActionResult> {
  const aiConfig = config as AIActionConfig

  // Get or create AI provider
  let provider: AIProvider
  try {
    provider = createAIProviderFromContext(context.environment, aiConfig.provider)
  } catch (err) {
    return createErrorResult(
      `Failed to create AI provider: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }

  const { type } = aiConfig

  switch (type) {
    case 'ai:generate':
      return handleGenerate(provider, aiConfig, context)
    case 'ai:analyze':
      return handleAnalyze(provider, aiConfig, context)
    case 'ai:transform':
      return handleTransform(provider, aiConfig, context)
    default:
      return createErrorResult(`Unknown AI action type: ${type}`)
  }
}

/**
 * Handle content/code generation
 */
async function handleGenerate(
  provider: AIProvider,
  config: AIActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Resolve templates in prompts
  const systemPrompt = config.systemPrompt
    ? resolveTemplate(config.systemPrompt, context)
    : undefined

  const userPrompt = resolveTemplate(config.userPrompt, context)

  try {
    const result = await provider.generate({
      systemPrompt,
      userPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      outputFormat: config.outputFormat,
    })

    // Parse JSON if that's the expected output format
    let outputData: any = result.content

    if (config.outputFormat === 'json') {
      try {
        outputData = JSON.parse(result.content)
      } catch {
        // Keep as string if JSON parsing fails
      }
    }

    // Store in context if outputTo is specified
    if (config.outputTo) {
      setContextVariable(context, config.outputTo, outputData)
    }

    return createSuccessResult(
      {
        content: outputData,
        model: result.model,
        usage: result.usage,
      },
      {
        reversible: false,
        metadata: {
          operation: 'generate',
          outputFormat: config.outputFormat,
          outputTo: config.outputTo,
          inputTokens: result.usage.inputTokens,
          outputTokens: result.usage.outputTokens,
        },
      }
    )
  } catch (err) {
    return createErrorResult(
      `AI generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle content analysis
 */
async function handleAnalyze(
  provider: AIProvider,
  config: AIActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Get input content to analyze
  const inputContent = config.inputContent
    ? resolveTemplate(config.inputContent, context)
    : ''

  if (!inputContent) {
    return createErrorResult('Input content is required for ai:analyze')
  }

  // Build analysis prompt
  const systemPrompt = config.systemPrompt
    ? resolveTemplate(config.systemPrompt, context)
    : 'You are an expert analyst. Analyze the provided content and return structured insights.'

  const userPrompt = `${resolveTemplate(config.userPrompt, context)}

Content to analyze:
${inputContent}`

  try {
    const result = await provider.generate({
      systemPrompt,
      userPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature || 0.3, // Lower temperature for analysis
      outputFormat: config.outputFormat || 'json',
    })

    let outputData: any = result.content

    if (config.outputFormat === 'json' || !config.outputFormat) {
      try {
        outputData = JSON.parse(result.content)
      } catch {
        // Keep as string
      }
    }

    if (config.outputTo) {
      setContextVariable(context, config.outputTo, outputData)
    }

    return createSuccessResult(
      {
        analysis: outputData,
        model: result.model,
        usage: result.usage,
      },
      {
        reversible: false,
        metadata: {
          operation: 'analyze',
          inputLength: inputContent.length,
          outputTo: config.outputTo,
        },
      }
    )
  } catch (err) {
    return createErrorResult(
      `AI analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle content transformation
 */
async function handleTransform(
  provider: AIProvider,
  config: AIActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Get input content to transform
  const inputContent = config.inputContent
    ? resolveTemplate(config.inputContent, context)
    : ''

  if (!inputContent) {
    return createErrorResult('Input content is required for ai:transform')
  }

  // Build transform prompt
  const systemPrompt = config.systemPrompt
    ? resolveTemplate(config.systemPrompt, context)
    : 'You are a content transformer. Transform the provided content according to the instructions.'

  const userPrompt = `${resolveTemplate(config.userPrompt, context)}

Content to transform:
${inputContent}

Respond with only the transformed content, no explanations.`

  try {
    const result = await provider.generate({
      systemPrompt,
      userPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature || 0.5,
      outputFormat: config.outputFormat || 'text',
    })

    let outputData: any = result.content

    if (config.outputFormat === 'json') {
      try {
        outputData = JSON.parse(result.content)
      } catch {
        // Keep as string
      }
    }

    if (config.outputTo) {
      setContextVariable(context, config.outputTo, outputData)
    }

    return createSuccessResult(
      {
        transformed: outputData,
        original: inputContent,
        model: result.model,
        usage: result.usage,
      },
      {
        beforeState: inputContent,
        afterState: outputData,
        reversible: false,
        metadata: {
          operation: 'transform',
          inputLength: inputContent.length,
          outputLength: typeof outputData === 'string' ? outputData.length : JSON.stringify(outputData).length,
          outputTo: config.outputTo,
        },
      }
    )
  } catch (err) {
    return createErrorResult(
      `AI transformation failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Convenience function for generating website structure
 */
export async function generateSiteStructure(
  provider: AIProvider,
  siteInfo: {
    name: string
    type: string
    industry: string
    description: string
  }
): Promise<{
  pages: Array<{ name: string; path: string; description: string }>
  components: Array<{ name: string; description: string }>
  features: string[]
}> {
  const result = await provider.generateJSON({
    systemPrompt: `You are a web architect designing website structures. Create comprehensive, practical site structures.`,
    userPrompt: `Design a website structure for:
- Site Name: ${siteInfo.name}
- Type: ${siteInfo.type}
- Industry: ${siteInfo.industry}
- Description: ${siteInfo.description}

Return a JSON object with:
1. "pages" - array of pages with name, path, and description
2. "components" - array of reusable components with name and description
3. "features" - array of key features to implement

Be practical and include all necessary pages for a complete website.`,
    maxTokens: 4000,
  })

  return result
}

/**
 * Convenience function for generating page code
 */
export async function generatePageCode(
  provider: AIProvider,
  pageInfo: {
    name: string
    path: string
    description: string
    siteType: string
    colorScheme: string
  }
): Promise<string> {
  const result = await provider.generateCode({
    systemPrompt: `You are an expert Next.js 14 developer. Generate production-ready React components using:
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Modern best practices

Generate complete, working code without placeholders.`,
    userPrompt: `Generate a complete page component for:
- Page Name: ${pageInfo.name}
- Route: ${pageInfo.path}
- Description: ${pageInfo.description}
- Site Type: ${pageInfo.siteType}
- Color Scheme: ${pageInfo.colorScheme}

Generate the full page code as a single file export.`,
    maxTokens: 8000,
  })

  return result
}
