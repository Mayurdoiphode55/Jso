import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Strip PII from comment text
function stripPII(text: string): string {
    // Remove email addresses
    let cleaned = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    // Remove phone numbers (various formats)
    cleaned = cleaned.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]')
    // Remove potential names (capitalized words that might be names — basic heuristic)
    // We'll keep this conservative to avoid removing important words
    return cleaned
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { survey_id, comment, star_rating, consultant_id } = body

        if (!survey_id || !comment) {
            return NextResponse.json(
                { error: 'Missing required fields: survey_id, comment' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Strip PII before sending to AI
        const anonymisedComment = stripPII(comment)

        // Call Groq API for sentiment analysis
        let aiResult = {
            sentiment: 'neutral' as string,
            key_issues: [] as string[],
            sentiment_score: 0,
            summary: 'No analysis available.',
        }

        try {
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            })

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a sentiment analysis engine for a career consultation platform.
Analyse the candidate feedback and return ONLY a JSON object with these fields:
{
  "sentiment": "positive" | "neutral" | "negative",
  "key_issues": ["issue1", "issue2"],
  "sentiment_score": <number between -1.0 and 1.0>,
  "summary": "<one sentence summary>"
}
Do not return anything other than the JSON object.`,
                    },
                    {
                        role: 'user',
                        content: anonymisedComment,
                    },
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.1,
                max_tokens: 256,
                response_format: { type: 'json_object' },
            })

            const responseText = chatCompletion.choices[0]?.message?.content || '{}'
            const parsed = JSON.parse(responseText)

            aiResult = {
                sentiment: parsed.sentiment || 'neutral',
                key_issues: Array.isArray(parsed.key_issues) ? parsed.key_issues : [],
                sentiment_score: typeof parsed.sentiment_score === 'number'
                    ? Math.max(-1, Math.min(1, parsed.sentiment_score))
                    : 0,
                summary: parsed.summary || 'No summary available.',
            }
        } catch (groqError) {
            console.error('Groq API error:', groqError)
            // Continue with default neutral analysis if Groq fails
        }

        // Calculate satisfaction score
        const ratingComponent = (star_rating || 3) / 5
        const sentimentComponent = (aiResult.sentiment_score + 1) / 2
        const satisfaction_score = Math.round(((ratingComponent + sentimentComponent) / 2) * 10)
        const clampedScore = Math.max(1, Math.min(10, satisfaction_score))
        const flagged = clampedScore < 6

        // Update survey with AI results
        const { error: updateError } = await supabase
            .from('surveys')
            .update({
                ai_sentiment: aiResult.sentiment,
                ai_key_issues: JSON.stringify(aiResult.key_issues),
                satisfaction_score: clampedScore,
                flagged,
            })
            .eq('id', survey_id)

        if (updateError) {
            console.error('Survey update error:', updateError)
            return NextResponse.json({ error: 'Failed to update survey' }, { status: 500 })
        }

        // Create alert if flagged
        if (flagged) {
            const { data: consultant } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', consultant_id)
                .single()

            const alertMessage = `Low satisfaction score (${clampedScore}/10) detected for ${consultant?.full_name || 'consultant'}. Key issues: ${aiResult.key_issues.join(', ') || 'none specified'}`

            await supabase.from('alerts').insert({
                survey_id,
                consultant_id,
                message: alertMessage,
            })
        }

        return NextResponse.json({
            success: true,
            analysis: {
                ...aiResult,
                satisfaction_score: clampedScore,
                flagged,
            },
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
