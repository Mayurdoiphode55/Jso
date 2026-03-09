import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { session_id, candidate_id, consultant_id, star_rating, comment } = body

        if (!session_id || !candidate_id || !consultant_id || !star_rating) {
            return NextResponse.json(
                { error: 'Missing required fields: session_id, candidate_id, consultant_id, star_rating' },
                { status: 400 }
            )
        }

        if (star_rating < 1 || star_rating > 5) {
            return NextResponse.json(
                { error: 'star_rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Create the survey record
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .insert({
                session_id,
                candidate_id,
                consultant_id,
                star_rating,
                comment: comment || '',
            })
            .select()
            .single()

        if (surveyError) {
            console.error('Survey creation error:', surveyError)
            return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 })
        }

        // If there's a comment, trigger AI analysis
        if (comment && comment.trim().length > 0) {
            try {
                const analyseResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL ? request.nextUrl.origin : 'http://localhost:3000'}/api/surveys/analyse`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            survey_id: survey.id,
                            comment,
                            star_rating,
                            consultant_id,
                        }),
                    }
                )

                if (!analyseResponse.ok) {
                    console.error('Analysis trigger failed:', await analyseResponse.text())
                }
            } catch (analyseError) {
                console.error('Failed to trigger analysis:', analyseError)
                // Don't fail the survey creation if analysis fails
            }
        } else {
            // No comment — calculate score from star rating only
            const satisfaction_score = Math.round((star_rating / 5) * 10)
            const flagged = satisfaction_score < 6

            await supabase
                .from('surveys')
                .update({
                    ai_sentiment: 'neutral',
                    ai_key_issues: '[]',
                    satisfaction_score,
                    flagged,
                })
                .eq('id', survey.id)

            // Create alert if flagged
            if (flagged) {
                const { data: consultant } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', consultant_id)
                    .single()

                await supabase.from('alerts').insert({
                    survey_id: survey.id,
                    consultant_id,
                    message: `Low satisfaction score (${satisfaction_score}/10) detected for ${consultant?.full_name || 'consultant'}. No detailed feedback provided.`,
                })
            }
        }

        return NextResponse.json({ success: true, survey })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
