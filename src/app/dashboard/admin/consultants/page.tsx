'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Star, AlertTriangle } from 'lucide-react'

interface ConsultantData {
    id: string
    name: string
    avgScore: number
    totalSessions: number
    flagged: number
    surveys: {
        id: string
        star_rating: number
        satisfaction_score: number | null
        ai_sentiment: string | null
        comment: string
        created_at: string
    }[]
}

export default function AdminConsultants() {
    const [consultants, setConsultants] = useState<ConsultantData[]>([])
    const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('role', 'hr_consultant')

            const { data: allSurveys } = await supabase
                .from('surveys')
                .select('*')
                .order('created_at', { ascending: false })

            const consultantStats: ConsultantData[] = (profiles || []).map(p => {
                const surveys = (allSurveys || []).filter(s => s.consultant_id === p.id)
                const scores = surveys.map(s => s.satisfaction_score).filter(Boolean) as number[]
                const avg = scores.length > 0
                    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
                    : 0

                return {
                    id: p.id,
                    name: p.full_name || 'Unknown',
                    avgScore: avg,
                    totalSessions: surveys.length,
                    flagged: surveys.filter(s => s.flagged).length,
                    surveys,
                }
            })

            setConsultants(consultantStats)
            setLoading(false)
        }
        load()
    }, [])

    const getScoreColor = (score: number) => {
        if (score >= 7) return 'text-emerald-600'
        if (score >= 5) return 'text-amber-600'
        return 'text-red-600'
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48" />
                <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
        )
    }

    const selected = consultants.find(c => c.id === selectedConsultant)

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={24} className="text-indigo-600" />
                    Consultant Performance
                </h1>
                <p className="text-gray-500 mt-1">Detailed performance data for each consultant</p>
            </div>

            {/* Consultant Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-3 font-medium">Consultant</th>
                            <th className="px-6 py-3 font-medium">Avg Score</th>
                            <th className="px-6 py-3 font-medium">Sessions</th>
                            <th className="px-6 py-3 font-medium">Flagged</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {consultants.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{c.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-semibold ${getScoreColor(c.avgScore)}`}>
                                        {c.avgScore}/10
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{c.totalSessions}</td>
                                <td className="px-6 py-4">
                                    {c.flagged > 0 ? (
                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                            {c.flagged}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">0</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedConsultant(selectedConsultant === c.id ? null : c.id)}
                                        className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                    >
                                        {selectedConsultant === c.id ? 'Hide' : 'View History'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Selected Consultant Survey History */}
            {selected && (
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Survey History — {selected.name}</h3>
                    </div>
                    {selected.surveys.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No surveys yet</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {selected.surveys.map(survey => (
                                <div key={survey.id} className={`p-4 ${(survey.satisfaction_score || 0) < 6 ? 'border-l-4 border-l-red-400' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < survey.star_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${survey.ai_sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' :
                                                    survey.ai_sentiment === 'negative' ? 'bg-red-50 text-red-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {survey.ai_sentiment || 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-semibold ${getScoreColor(survey.satisfaction_score || 0)}`}>
                                                {survey.satisfaction_score || '—'}/10
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(survey.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                    {survey.comment && (
                                        <p className="text-sm text-gray-600 italic">&quot;{survey.comment}&quot;</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
