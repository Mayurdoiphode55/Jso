import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createServiceClient()

        // Get all surveys for this consultant
        const { data: surveys, error } = await supabase
            .from('surveys')
            .select('*')
            .eq('consultant_id', id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching consultant surveys:', error)
            return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
        }

        // Calculate aggregate stats
        const totalSurveys = surveys?.length || 0
        const scores = surveys?.map(s => s.satisfaction_score).filter(Boolean) as number[]
        const averageScore = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
            : 0
        const flaggedCount = surveys?.filter(s => s.flagged).length || 0

        // Trend data (last 8 surveys)
        const trendData = surveys?.slice(0, 8).reverse().map((s, i) => ({
            session: `Session ${i + 1}`,
            score: s.satisfaction_score || 0,
            date: s.created_at,
        })) || []

        return NextResponse.json({
            surveys,
            stats: {
                totalSurveys,
                averageScore,
                flaggedCount,
            },
            trendData,
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
