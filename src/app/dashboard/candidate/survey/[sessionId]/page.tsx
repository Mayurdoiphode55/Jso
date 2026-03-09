'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Star, Send, CheckCircle, Shield, ArrowLeft } from 'lucide-react'

export default function SurveyPage() {
    const params = useParams()
    const sessionId = params.sessionId as string
    const router = useRouter()
    const supabase = createClient()

    const [consultantName, setConsultantName] = useState('')
    const [starRating, setStarRating] = useState(0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<{
        satisfaction_score: number
        sentiment: string
    } | null>(null)
    const [sessionData, setSessionData] = useState<{
        candidate_id: string
        consultant_id: string
    } | null>(null)

    useEffect(() => {
        loadSessionData()
    }, [sessionId])

    async function loadSessionData() {
        const { data: session } = await supabase
            .from('sessions')
            .select('*, consultant:profiles!sessions_consultant_id_fkey(full_name)')
            .eq('id', sessionId)
            .single()

        if (session) {
            setConsultantName(session.consultant?.full_name || 'your consultant')
            setSessionData({
                candidate_id: session.candidate_id,
                consultant_id: session.consultant_id,
            })
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (starRating === 0) return
        setLoading(true)

        try {
            const response = await fetch('/api/surveys/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    candidate_id: sessionData?.candidate_id,
                    consultant_id: sessionData?.consultant_id,
                    star_rating: starRating,
                    comment: comment.trim() || '',
                }),
            })

            if (response.ok) {
                const data = await response.json()
                // Wait a moment for analysis to complete
                await new Promise(resolve => setTimeout(resolve, 2000))

                // Fetch the updated survey to get the score
                const { data: survey } = await supabase
                    .from('surveys')
                    .select('satisfaction_score, ai_sentiment')
                    .eq('session_id', sessionId)
                    .single()

                if (survey) {
                    setAnalysisResult({
                        satisfaction_score: survey.satisfaction_score || starRating * 2,
                        sentiment: survey.ai_sentiment || 'neutral',
                    })
                }
                setSubmitted(true)
            }
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setLoading(false)
        }
    }

    const starLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto mt-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you for your feedback!</h2>
                    <p className="text-gray-500 mb-6">Your response helps us improve the consultation experience for everyone.</p>

                    {analysisResult && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Your satisfaction score</p>
                            <p className={`text-3xl font-bold ${analysisResult.satisfaction_score >= 7 ? 'text-emerald-600' :
                                    analysisResult.satisfaction_score >= 5 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                {analysisResult.satisfaction_score}/10
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
                        <Shield size={14} />
                        <span>Your feedback was anonymised before AI analysis</span>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/candidate')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto mt-4">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    How was your consultation?
                </h2>
                <p className="text-gray-500 mb-8">
                    with <span className="font-medium text-gray-700">{consultantName}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Rate your experience
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setStarRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors ${star <= (hoveredStar || starRating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            {(hoveredStar || starRating) > 0 && (
                                <span className="text-sm text-gray-500 ml-2">
                                    {starLabels[(hoveredStar || starRating) - 1]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Tell us more <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What went well? What could be improved?"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                        />
                    </div>

                    {/* Privacy Notice */}
                    <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                        <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                            Your feedback is anonymised before AI analysis. Your identity is never shared with AI systems.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={starRating === 0 || loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analysing your feedback...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
