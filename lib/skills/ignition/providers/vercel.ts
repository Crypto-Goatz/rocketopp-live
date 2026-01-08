// Vercel Provider for Ignition
// Handles project creation, deployment, env vars, and domain configuration

interface VercelConfig {
  token: string
  teamId?: string
}

interface CreateProjectOptions {
  name: string
  framework?: 'nextjs' | 'react' | 'vue' | 'static'
  gitRepository?: {
    type: 'github' | 'gitlab' | 'bitbucket'
    repo: string
  }
}

interface DeploymentFile {
  path: string
  content: string
  encoding?: 'utf-8' | 'base64'
}

interface DeployOptions {
  projectId: string
  files: DeploymentFile[]
  target?: 'production' | 'preview'
  buildCommand?: string
  installCommand?: string
  outputDirectory?: string
}

interface VercelProject {
  id: string
  name: string
  accountId: string
  framework: string | null
  createdAt: number
  updatedAt: number
}

interface VercelDeployment {
  id: string
  url: string
  name: string
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'QUEUED'
  readyState?: 'READY' | 'ERROR'
  createdAt: number
  buildingAt?: number
  ready?: number
}

interface VercelDomain {
  name: string
  verified: boolean
  createdAt: number
}

/**
 * Vercel API Provider
 */
export class VercelProvider {
  private baseUrl = 'https://api.vercel.com'
  private token: string
  private teamId?: string

  constructor(config: VercelConfig) {
    this.token = config.token
    this.teamId = config.teamId
  }

  /**
   * Make authenticated request to Vercel API
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(path, this.baseUrl)

    // Add team ID if present
    if (this.teamId) {
      url.searchParams.set('teamId', this.teamId)
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(
        `Vercel API error: ${response.status} - ${error.error?.message || response.statusText}`
      )
    }

    return response.json()
  }

  /**
   * Create a new Vercel project
   */
  async createProject(options: CreateProjectOptions): Promise<VercelProject> {
    const body: any = {
      name: options.name,
    }

    if (options.framework) {
      body.framework = options.framework
    }

    if (options.gitRepository) {
      body.gitRepository = options.gitRepository
    }

    return this.request<VercelProject>('/v9/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  /**
   * Get a project by ID or name
   */
  async getProject(idOrName: string): Promise<VercelProject | null> {
    try {
      return await this.request<VercelProject>(`/v9/projects/${idOrName}`)
    } catch (err) {
      return null
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(idOrName: string): Promise<void> {
    await this.request(`/v9/projects/${idOrName}`, {
      method: 'DELETE',
    })
  }

  /**
   * Deploy files to a project
   */
  async deploy(options: DeployOptions): Promise<VercelDeployment> {
    // Convert files to Vercel format
    const files = options.files.map((file) => ({
      file: file.path,
      data: file.encoding === 'base64'
        ? file.content
        : Buffer.from(file.content, 'utf-8').toString('base64'),
    }))

    const body: any = {
      name: options.projectId,
      files,
      target: options.target || 'production',
    }

    // Add build settings if provided
    if (options.buildCommand || options.installCommand || options.outputDirectory) {
      body.projectSettings = {}
      if (options.buildCommand) body.projectSettings.buildCommand = options.buildCommand
      if (options.installCommand) body.projectSettings.installCommand = options.installCommand
      if (options.outputDirectory) body.projectSettings.outputDirectory = options.outputDirectory
    }

    return this.request<VercelDeployment>('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  /**
   * Get deployment status
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    return this.request<VercelDeployment>(`/v13/deployments/${deploymentId}`)
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(
    deploymentId: string,
    timeoutMs: number = 300000 // 5 minutes
  ): Promise<VercelDeployment> {
    const startTime = Date.now()
    const pollInterval = 3000 // 3 seconds

    while (Date.now() - startTime < timeoutMs) {
      const deployment = await this.getDeployment(deploymentId)

      if (deployment.state === 'READY' || deployment.readyState === 'READY') {
        return deployment
      }

      if (deployment.state === 'ERROR' || deployment.readyState === 'ERROR') {
        throw new Error('Deployment failed')
      }

      if (deployment.state === 'CANCELED') {
        throw new Error('Deployment was canceled')
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }

    throw new Error('Deployment timed out')
  }

  /**
   * Set environment variables for a project
   */
  async setEnvVars(
    projectId: string,
    envVars: Record<string, string>,
    target: ('production' | 'preview' | 'development')[] = ['production', 'preview']
  ): Promise<void> {
    const envs = Object.entries(envVars).map(([key, value]) => ({
      key,
      value,
      type: 'encrypted',
      target,
    }))

    for (const env of envs) {
      await this.request(`/v10/projects/${projectId}/env`, {
        method: 'POST',
        body: JSON.stringify(env),
      })
    }
  }

  /**
   * Get environment variables for a project
   */
  async getEnvVars(projectId: string): Promise<Record<string, string>> {
    const response = await this.request<{ envs: Array<{ key: string; value?: string }> }>(
      `/v9/projects/${projectId}/env`
    )

    const result: Record<string, string> = {}
    for (const env of response.envs) {
      if (env.value) {
        result[env.key] = env.value
      }
    }
    return result
  }

  /**
   * Add a custom domain to a project
   */
  async addDomain(projectId: string, domain: string): Promise<VercelDomain> {
    return this.request<VercelDomain>(`/v10/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: domain }),
    })
  }

  /**
   * Remove a domain from a project
   */
  async removeDomain(projectId: string, domain: string): Promise<void> {
    await this.request(`/v9/projects/${projectId}/domains/${domain}`, {
      method: 'DELETE',
    })
  }

  /**
   * Get domains for a project
   */
  async getDomains(projectId: string): Promise<VercelDomain[]> {
    const response = await this.request<{ domains: VercelDomain[] }>(
      `/v9/projects/${projectId}/domains`
    )
    return response.domains
  }

  /**
   * Verify a domain
   */
  async verifyDomain(projectId: string, domain: string): Promise<{ verified: boolean }> {
    return this.request(`/v9/projects/${projectId}/domains/${domain}/verify`, {
      method: 'POST',
    })
  }
}

/**
 * Create a Vercel provider instance from environment
 */
export function createVercelProvider(): VercelProvider {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    throw new Error('VERCEL_TOKEN environment variable is required')
  }

  return new VercelProvider({
    token,
    teamId: process.env.VERCEL_TEAM_ID,
  })
}

/**
 * Create a Vercel provider from skill context environment
 */
export function createVercelProviderFromContext(
  environment: Record<string, string>
): VercelProvider {
  const token = environment.VERCEL_TOKEN || process.env.VERCEL_TOKEN
  if (!token) {
    throw new Error('VERCEL_TOKEN not found in context or environment')
  }

  return new VercelProvider({
    token,
    teamId: environment.VERCEL_TEAM_ID || process.env.VERCEL_TEAM_ID,
  })
}
