'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Survey, Profile } from '@/lib/types'
import {
    BarChart3, AlertTriangle, Star, TrendingUp, MessageSquare,
    Users, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'

export default function ConsultantDashboard() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [stats, setStats] = useState({ avgScore: 0, totalSessions: 0, flagged: 0, totalSurveys: 0 })
    const [trendData, setTrendData] = useState<{ session: string; score: number }[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadData()

        // Real-time subscription for new surveys
        const channel = supabase
            .channel('consultant-surveys')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'surveys' }, () => {
                loadData()
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'surveys' }, () => {
                loadData()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    async function loadData() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        setProfile(profileData)

        const response = await fetch(`/api/surveys/consultant/${user.id}`)
        if (response.ok) {
            const data = await response.json()
            setSurveys(data.surveys || [])
            setStats({
                avgScore: data.stats.averageScore,
                totalSessions: data.stats.totalSurveys,
                flagged: data.stats.flaggedCount,
                totalSurveys: data.stats.totalSurveys,
            })
            setTrendData(data.trendData || [])
        }

        // Count sessions this month
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const { count } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('consultant_id', user.id)
            .gte('session_date', startOfMonth.toISOString())

        setStats(prev => ({ ...prev, totalSessions: count || prev.totalSessions }))
        setLoading(false)
    }

    const parseKeyIssues = (issues: string | null): string[] => {
        if (!issues) return []
        try { return JSON.parse(issues) } catch { return [] }
    }

    const getScoreColor = (score: number) => {
        if (score >= 7) return 'text-emerald-600'
        if (score >= 5) return 'text-amber-600'
        return 'text-red-600'
    }

    const getScoreBg = (score: number) => {
        if (score >= 7) return 'bg-emerald-50 border-emerald-200'
        if (score >= 5) return 'bg-amber-50 border-amber-200'
        return 'bg-red-50 border-red-200'
    }

    const getSentimentIcon = (sentiment: string | null) => {
        switch (sentiment) {
            case 'positive': return <ThumbsUp size={14} className="text-emerald-600" />
            case 'negative': return <ThumbsDown size={14} className="text-red-600" />
            default: return <Minus size={14} className="text-gray-400" />
        }
    }

    const getSentimentBadge = (sentiment: string | null) => {
        switch (sentiment) {
            case 'positive': return 'bg-emerald-50 text-emerald-700'
            case 'negative': return 'bg-red-50 text-red-700'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-64" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
                </div>
                <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Performance Dashboard</h1>
                <p className="text-gray-500 mt-1">Your satisfaction metrics and feedback analysis</p>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Average Score — Large */}
                <div className={`rounded-2xl border p-5 ${getScoreBg(stats.avgScore)}`}>
                    <p className="text-sm font-medium opacity-70 mb-1">Average Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(stats.avgScore)}`}>
                        {stats.avgScore || '—'}
                        <span className="text-lg font-normal opacity-60">/10</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Users size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalSessions}</p>
                            <p className="text-sm text-gray-500">Sessions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.flagged > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <AlertTriangle size={18} className={stats.flagged > 0 ? 'text-red-600' : 'text-gray-400'} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.flagged}</p>
                            <p className="text-sm text-gray-500">Flagged</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                            <MessageSquare size={18} className="text-violet-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalSurveys}</p>
                            <p className="text-sm text-gray-500">Surveys</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            {trendData.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Satisfaction Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="session" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#6366f1', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Recent Feedback */}
            <div className="bg-white rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Recent Feedback</h3>
                </div>

                {surveys.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">No feedback received yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {surveys.slice(0, 5).map((survey) => (
                            <div
                                key={survey.id}
                                className={`p-5 ${survey.flagged ? 'border-l-4 border-l-red-400' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < survey.star_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentBadge(survey.ai_sentiment)}`}>
                                            {getSentimentIcon(survey.ai_sentiment)}
                                            {survey.ai_sentiment ? survey.ai_sentiment.charAt(0).toUpperCase() + survey.ai_sentiment.slice(1) : 'Pending'}
                                        </span>
                                    </div>
                                    {survey.satisfaction_score && (
                                        <span className={`text-sm font-semibold ${getScoreColor(survey.satisfaction_score)}`}>
                                            {survey.satisfaction_score}/10
                                        </span>
                                    )}
                                </div>

                                {survey.comment && (
                                    <p className="text-sm text-gray-600 mb-2">&quot;{survey.comment}&quot;</p>
                                )}

                                <div className="flex flex-wrap gap-1.5">
                                    {parseKeyIssues(survey.ai_key_issues).map((issue, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {issue}
                                        </span>
                                    ))}
                                </div>

                                {survey.flagged && (
                                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                        <p className="text-xs font-medium text-amber-800">
                                            💡 Improvement Tip: {parseKeyIssues(survey.ai_key_issues).length > 0
                                                ? `Consider addressing: ${parseKeyIssues(survey.ai_key_issues).join(', ')}.`
                                                : 'Review this session for areas of improvement.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
