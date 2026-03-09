'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Survey } from '@/lib/types'
import { Star, History, MessageSquare } from 'lucide-react'

export default function CandidateHistory() {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadSurveys() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('surveys')
                .select(`
          *,
          consultant:profiles!surveys_consultant_id_fkey(full_name)
        `)
                .eq('candidate_id', user.id)
                .order('created_at', { ascending: false })

            setSurveys(data || [])
            setLoading(false)
        }
        loadSurveys()
    }, [])

    const parseKeyIssues = (issues: string | null): string[] => {
        if (!issues) return []
        try {
            return JSON.parse(issues)
        } catch {
            return []
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <History size={24} className="text-indigo-600" />
                    Feedback History
                </h1>
                <p className="text-gray-500 mt-1">Your past survey responses and AI analysis summaries</p>
            </div>

            {surveys.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No surveys yet — your feedback will appear here after submission</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {surveys.map((survey) => (
                        <div key={survey.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(survey.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <p className="font-medium text-gray-900 mt-0.5">
                                        Session with {(survey as any).consultant?.full_name || 'Consultant'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={
                                                i < survey.star_rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {survey.comment && (
                                <p className="text-sm text-gray-600 mb-3 italic">&quot;{survey.comment}&quot;</p>
                            )}

                            {survey.ai_sentiment && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${survey.ai_sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' :
                                            survey.ai_sentiment === 'negative' ? 'bg-red-50 text-red-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {survey.ai_sentiment.charAt(0).toUpperCase() + survey.ai_sentiment.slice(1)}
                                    </span>
                                    {survey.satisfaction_score && (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${survey.satisfaction_score >= 7 ? 'bg-emerald-50 text-emerald-700' :
                                                survey.satisfaction_score >= 5 ? 'bg-amber-50 text-amber-700' :
                                                    'bg-red-50 text-red-700'
                                            }`}>
                                            Score: {survey.satisfaction_score}/10
                                        </span>
                                    )}
                                    {parseKeyIssues(survey.ai_key_issues).map((issue, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                            {issue}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
