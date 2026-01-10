import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all projects with client info
    const { data: projects, error } = await supabase
      .from('agency_projects')
      .select(`
        *,
        agency_clients (name, slug)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ projects: getMockProjects() })
    }

    // Transform to flatten client info
    const transformedProjects = (projects || []).map(project => ({
      ...project,
      client_name: project.agency_clients?.name,
      client_slug: project.agency_clients?.slug,
      agency_clients: undefined
    }))

    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({ projects: getMockProjects() })
  }
}

function getMockProjects() {
  return [
    {
      id: 'p1',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'RocketOpp.com Website',
      description: 'Main agency website with AI assessment, lead capture, and client dashboard',
      status: 'active',
      project_type: 'website',
      progress: 85,
      github_repo: 'Crypto-Goatz/rocketopp-live',
      live_url: 'https://rocketopp.com',
      due_date: null
    },
    {
      id: 'p2',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'Rocket+ (GHL Marketplace App)',
      description: 'GoHighLevel marketplace app with RocketFlow, AI tools, and automation',
      status: 'active',
      project_type: 'app',
      progress: 90,
      github_repo: 'Crypto-Goatz/rocket-mods',
      live_url: 'https://rocketadd.com',
      due_date: null
    },
    {
      id: 'p3',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'Spark AI Assessment',
      description: 'Interactive AI-powered business assessment with lead capture',
      status: 'active',
      project_type: 'automation',
      progress: 95,
      github_repo: null,
      live_url: 'https://rocketopp.com/assessment',
      due_date: null
    },
    {
      id: 'p4',
      client_id: '2',
      client_name: 'ABK Unlimited',
      client_slug: 'abk-unlimited',
      name: 'ABK Website',
      description: 'Full-service contractor website with lead capture, portfolio, and AI visualizer',
      status: 'completed',
      project_type: 'website',
      progress: 100,
      github_repo: 'Crypto-Goatz/ABK-Unlimited',
      live_url: 'https://abkunlimited.com',
      due_date: null
    },
    {
      id: 'p5',
      client_id: '2',
      client_name: 'ABK Unlimited',
      client_slug: 'abk-unlimited',
      name: 'SEO & Local Marketing',
      description: 'Ongoing SEO optimization and local search presence',
      status: 'active',
      project_type: 'seo',
      progress: 60,
      github_repo: null,
      live_url: null,
      due_date: null
    }
  ]
}
