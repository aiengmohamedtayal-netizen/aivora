import { NextResponse } from 'next/server'
import { createClient } from '@aivora/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check DB connection
    const { error } = await supabase.from('categories').select('id').limit(1)
    
    if (error) {
      throw new Error('Database connection failed')
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        api: 'up'
      }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}
