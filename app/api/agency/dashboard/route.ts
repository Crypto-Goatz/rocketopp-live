import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all clients with project counts
    const { data: clients, error: clientsError } = await supabase
      .from('agency_clients')
      .select(`
        *,
        agency_projects (id),
        agency_tasks (id, status)
      `)
      .order('health_score', { ascending: false })

    if (clientsError) {
      console.error('Error fetching clients:', clientsError)
      // Return mock data if table doesn't exist yet
      return NextResponse.json({
        clients: getMockClients(),
        stats: getMockStats()
      })
    }

    // Process clients to add counts
    const processedClients = (clients || []).map(client => ({
      ...client,
      projects_count: client.agency_projects?.length || 0,
      tasks_pending: client.agency_tasks?.filter((t: { status: string }) => t.status !== 'completed').length || 0,
      agency_projects: undefined,
      agency_tasks: undefined
    }))

    // Calculate stats
    const activeClients = processedClients.filter(c => c.status === 'active')
    const stats = {
      total_clients: processedClients.length,
      active_clients: activeClients.length,
      total_mrr: processedClients.reduce((sum, c) => sum + (c.monthly_retainer || 0), 0),
      avg_health_score: Math.round(
        processedClients.reduce((sum, c) => sum + (c.health_score || 0), 0) / (processedClients.length || 1)
      ),
      projects_active: processedClients.reduce((sum, c) => sum + (c.projects_count || 0), 0),
      tasks_pending: processedClients.reduce((sum, c) => sum + (c.tasks_pending || 0), 0)
    }

    return NextResponse.json({
      clients: processedClients,
      stats
    })
  } catch (error) {
    console.error('Agency dashboard error:', error)
    // Return mock data on error
    return NextResponse.json({
      clients: getMockClients(),
      stats: getMockStats()
    })
  }
}

// Mock data for when database isn't set up yet
function getMockClients() {
  return [
    {
      id: '1',
      name: 'RocketOpp',
      slug: 'rocketopp',
      industry: 'Technology / Agency',
      status: 'active',
      health_score: 100,
      monthly_retainer: 0,
      last_activity_at: new Date().toISOString(),
      integrations: {
        ghl: { connected: true },
        mcp: { connected: true },
        analytics: { connected: true },
        vercel: { connected: true }
      },
      projects_count: 3,
      tasks_pending: 2
    },
    {
      id: '2',
      name: 'ABK Unlimited',
      slug: 'abk-unlimited',
      industry: 'Home Services / Construction',
      status: 'active',
      health_score: 92,
      monthly_retainer: 2500,
      last_activity_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      integrations: {
        ghl: { connected: true },
        vercel: { connected: true }
      },
      projects_count: 3,
      tasks_pending: 5
    }
  ]
}

function getMockStats() {
  return {
    total_clients: 2,
    active_clients: 2,
    total_mrr: 2500,
    avg_health_score: 96,
    projects_active: 6,
    tasks_pending: 7
  }
}
