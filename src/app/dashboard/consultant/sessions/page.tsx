'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Survey } from '@/lib/types'
import { Star, Filter, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

export default function ConsultantSessions() {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [filter, setFilter] = useState<'all' | 'flagged' | 'high'>('all')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const response = await fetch(`/api/surveys/consultant/${user.id}`)
            if (response.ok) {
                const data = await response.json()
                setSurveys(data.surveys || [])
            }
            setLoading(false)
        }
        load()
    }, [])

    const filteredSurveys = surveys.filter(s => {
        if (filter === 'flagged') return s.flagged
        if (filter === 'high') return (s.satisfaction_score || 0) >= 7
        return true
    })

    const parseKeyIssues = (issues: string | null): string[] => {
        if (!issues) return []
        try { return JSON.parse(issues) } catch { return [] }
    }

    const getSentimentBadge = (sentiment: string | null) => {
        switch (sentiment) {
            case 'positive': return { bg: 'bg-emerald-50 text-emerald-700', icon: <ThumbsUp size={12} /> }
            case 'negative': return { bg: 'bg-red-50 text-red-700', icon: <ThumbsDown size={12} /> }
            default: return { bg: 'bg-gray-100 text-gray-600', icon: <Minus size={12} /> }
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48" />
                <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Sessions & Feedback</h1>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    {(['all', 'flagged', 'high'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {f === 'all' ? 'All' : f === 'flagged' ? 'Flagged Only' : 'High Rating'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredSurveys.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No sessions match this filter
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Candidate</th>
                                <th className="px-6 py-3 font-medium">Score</th>
                                <th className="px-6 py-3 font-medium">Sentiment</th>
                                <th className="px-6 py-3 font-medium">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSurveys.map((survey, index) => {
                                const sentiment = getSentimentBadge(survey.ai_sentiment)
                                return (
                                    <tr
                                        key={survey.id}
                                        className={`hover:bg-gray-50 transition-colors ${survey.flagged ? 'border-l-4 border-l-red-400' : ''}`}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(survey.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            Candidate {String.fromCharCode(65 + index)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${(survey.satisfaction_score || 0) >= 7 ? 'text-emerald-600' :
                                                    (survey.satisfaction_score || 0) >= 5 ? 'text-amber-600' :
                                                        'text-red-600'
                                                }`}>
                                                {survey.satisfaction_score || '—'}/10
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sentiment.bg}`}>
                                                {sentiment.icon}
                                                {survey.ai_sentiment ? survey.ai_sentiment.charAt(0).toUpperCase() + survey.ai_sentiment.slice(1) : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < survey.star_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
