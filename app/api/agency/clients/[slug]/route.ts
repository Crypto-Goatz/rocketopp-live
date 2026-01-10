import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    // Fetch client
    const { data: client, error: clientError } = await supabase
      .from('agency_clients')
      .select('*')
      .eq('slug', slug)
      .single()

    if (clientError || !client) {
      // Return mock data if not found
      return NextResponse.json(getMockClientData(slug))
    }

    // Fetch projects
    const { data: projects } = await supabase
      .from('agency_projects')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })

    // Fetch integrations
    const { data: integrations } = await supabase
      .from('agency_integrations')
      .select('*')
      .eq('client_id', client.id)
      .order('integration_type')

    // Fetch tasks
    const { data: tasks } = await supabase
      .from('agency_tasks')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      client,
      projects: projects || [],
      integrations: integrations || [],
      tasks: tasks || []
    })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(getMockClientData(slug))
  }
}

function getMockClientData(slug: string) {
  if (slug === 'rocketopp') {
    return {
      client: {
        id: '1',
        name: 'RocketOpp',
        slug: 'rocketopp',
        industry: 'Technology / Agency',
        status: 'active',
        billing_type: 'retainer',
        monthly_retainer: 0,
        health_score: 100,
        last_activity_at: new Date().toISOString(),
        primary_contact_name: 'Internal Team',
        primary_contact_email: 'team@rocketopp.com',
        primary_contact_phone: '(878) 888-1230',
        website: 'https://rocketopp.com',
        integrations: {
          ghl: { connected: true },
          mcp: { connected: true },
          analytics: { connected: true }
        },
        notes: 'Internal agency management. Full MCP and API access. This is our own company - all integrations should be connected and working.'
      },
      projects: [
        {
          id: 'p1',
          name: 'RocketOpp.com Website',
          description: 'Main agency website with AI assessment, lead capture, and client dashboard',
          status: 'active',
          project_type: 'website',
          progress: 85,
          github_repo: 'Crypto-Goatz/rocketopp-live',
          live_url: 'https://rocketopp.com',
          staging_url: null
        },
        {
          id: 'p2',
          name: 'Rocket+ (GHL Marketplace App)',
          description: 'GoHighLevel marketplace app with RocketFlow, AI tools, and automation',
          status: 'active',
          project_type: 'app',
          progress: 90,
          github_repo: 'Crypto-Goatz/rocket-mods',
          live_url: 'https://rocketadd.com',
          staging_url: null
        },
        {
          id: 'p3',
          name: 'Spark AI Assessment',
          description: 'Interactive AI-powered business assessment with lead capture',
          status: 'active',
          project_type: 'automation',
          progress: 95,
          github_repo: null,
          live_url: 'https://rocketopp.com/assessment',
          staging_url: null
        }
      ],
      integrations: [
        {
          id: 'i1',
          integration_type: 'ghl',
          name: 'GoHighLevel CRM',
          status: 'connected',
          config: {
            location_id: '6MSqx0trfxgLxeHBJE1k',
            features: ['contacts', 'pipelines', 'workflows', 'sms', 'email']
          },
          last_sync_at: new Date().toISOString(),
          error_message: null
        },
        {
          id: 'i2',
          integration_type: 'mcp',
          name: 'MCP Server (Internal)',
          status: 'connected',
          config: {
            endpoint: 'localhost:3001',
            tools: ['analytics', 'leads', 'content', 'skills', 'ghl']
          },
          last_sync_at: new Date().toISOString(),
          error_message: null
        },
        {
          id: 'i3',
          integration_type: 'analytics',
          name: 'Google Analytics 4',
          status: 'connected',
          config: {
            property_id: 'GA4-ROCKETOPP',
            features: ['pageviews', 'events', 'conversions']
          },
          last_sync_at: new Date(Date.now() - 3600000).toISOString(),
          error_message: null
        },
        {
          id: 'i4',
          integration_type: 'custom_api',
          name: 'Anthropic Claude API',
          status: 'connected',
          config: {
            model: 'claude-sonnet-4-20250514',
            use_cases: ['spark_assessment', 'content_generation']
          },
          last_sync_at: new Date().toISOString(),
          error_message: null
        }
      ],
      tasks: [
        { id: 't1', title: 'Complete agency dashboard', status: 'in_progress', priority: 'high', due_date: null },
        { id: 't2', title: 'Set up EcoSpray Solutions onboarding', status: 'todo', priority: 'high', due_date: null }
      ]
    }
  }

  if (slug === 'abk-unlimited') {
    return {
      client: {
        id: '2',
        name: 'ABK Unlimited',
        slug: 'abk-unlimited',
        industry: 'Home Services / Construction',
        status: 'active',
        billing_type: 'retainer',
        monthly_retainer: 2500,
        health_score: 92,
        last_activity_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        primary_contact_name: 'ABK Team',
        primary_contact_email: 'contact@abkunlimited.com',
        primary_contact_phone: null,
        website: 'https://abkunlimited.com',
        integrations: {
          ghl: { connected: true },
          vercel: { connected: true }
        },
        notes: 'Home services contractor. Kitchen, bathroom, roofing, remodeling. $2,500/mo retainer. Website live with 3D visualizer tool.'
      },
      projects: [
        {
          id: 'p1',
          name: 'ABK Website',
          description: 'Full-service contractor website with lead capture, portfolio, and AI visualizer',
          status: 'active',
          project_type: 'website',
          progress: 100,
          github_repo: 'Crypto-Goatz/ABK-Unlimited',
          live_url: 'https://abkunlimited.com',
          staging_url: null
        },
        {
          id: 'p2',
          name: 'GHL Pipeline Setup',
          description: 'Sales pipeline configuration and automation workflows',
          status: 'completed',
          project_type: 'automation',
          progress: 100,
          github_repo: null,
          live_url: null,
          staging_url: null
        },
        {
          id: 'p3',
          name: 'SEO & Local Marketing',
          description: 'Ongoing SEO optimization and local search presence',
          status: 'active',
          project_type: 'seo',
          progress: 60,
          github_repo: null,
          live_url: null,
          staging_url: null
        }
      ],
      integrations: [
        {
          id: 'i1',
          integration_type: 'ghl',
          name: 'GoHighLevel CRM',
          status: 'connected',
          config: {
            location_id: 'abk-location',
            pipeline_id: 'G9L7BKFIGlD7140Ebh9x',
            features: ['contacts', 'pipelines', 'sms']
          },
          last_sync_at: new Date(Date.now() - 1800000).toISOString(),
          error_message: null
        },
        {
          id: 'i2',
          integration_type: 'custom_api',
          name: 'Gemini Vision API',
          status: 'connected',
          config: {
            use_cases: ['3d_visualizer', 'room_analysis']
          },
          last_sync_at: new Date(Date.now() - 7200000).toISOString(),
          error_message: null
        }
      ],
      tasks: [
        { id: 't1', title: 'Monthly SEO report', status: 'todo', priority: 'medium', due_date: '2026-01-15' },
        { id: 't2', title: 'Add new portfolio projects', status: 'todo', priority: 'low', due_date: null },
        { id: 't3', title: 'Review Google My Business listing', status: 'in_progress', priority: 'medium', due_date: null },
        { id: 't4', title: 'Set up review request automation', status: 'todo', priority: 'high', due_date: '2026-01-12' },
        { id: 't5', title: 'Update service area pages', status: 'todo', priority: 'medium', due_date: null }
      ]
    }
  }

  // Default empty response
  return {
    client: null,
    projects: [],
    integrations: [],
    tasks: []
  }
}
