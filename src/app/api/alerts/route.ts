import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createServiceClient()

        const { data: alerts, error } = await supabase
            .from('alerts')
            .select(`
        *,
        consultant:profiles!alerts_consultant_id_fkey(full_name, role),
        survey:surveys!alerts_survey_id_fkey(star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, created_at)
      `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching alerts:', error)
            return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
        }

        return NextResponse.json({ alerts })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { alert_id, resolved } = body

        if (!alert_id) {
            return NextResponse.json(
                { error: 'Missing required field: alert_id' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        const { error } = await supabase
            .from('alerts')
            .update({ resolved: resolved !== undefined ? resolved : true })
            .eq('id', alert_id)

        if (error) {
            console.error('Error updating alert:', error)
            return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
