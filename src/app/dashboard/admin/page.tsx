'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Survey, Profile } from '@/lib/types'
import {
    BarChart3, AlertTriangle, Users, MessageSquare, TrendingUp,
    CheckCircle, Shield
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ avgScore: 0, totalSessions: 0, activeAlerts: 0, totalSurveys: 0 })
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [consultants, setConsultants] = useState<{ id: string; name: string; avgScore: number; totalSessions: number; flagged: number }[]>([])
    const [trendData, setTrendData] = useState<{ date: string; score: number }[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadData()

        // Real-time subscription for alerts
        const channel = supabase
            .channel('admin-alerts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
                loadData()
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'surveys' }, () => {
                loadData()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    async function loadData() {
        // Get all surveys
        const { data: surveys } = await supabase
            .from('surveys')
            .select('*')
            .order('created_at', { ascending: true })

        // Get all sessions count
        const { count: sessionCount } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })

        // Get alerts
        const alertsResponse = await fetch('/api/alerts')
        let alertsData: Alert[] = []
        if (alertsResponse.ok) {
            const data = await alertsResponse.json()
            alertsData = data.alerts || []
        }
        setAlerts(alertsData)

        const unresolvedAlerts = alertsData.filter(a => !a.resolved)

        // Calculate platform score
        const scores = (surveys || []).map(s => s.satisfaction_score).filter(Boolean) as number[]
        const avgScore = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
            : 0

        setStats({
            avgScore,
            totalSessions: sessionCount || 0,
            activeAlerts: unresolvedAlerts.length,
            totalSurveys: surveys?.length || 0,
        })

        // Build trend data
        const surveysByDate = new Map<string, number[]>()
            ; (surveys || []).forEach(s => {
                if (s.satisfaction_score) {
                    const dateKey = new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    const existing = surveysByDate.get(dateKey) || []
                    existing.push(s.satisfaction_score)
                    surveysByDate.set(dateKey, existing)
                }
            })

        const trend = Array.from(surveysByDate.entries()).map(([date, scores]) => ({
            date,
            score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        }))
        setTrendData(trend)

        // Build consultant leaderboard
        const { data: consultantProfiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('role', 'hr_consultant')

        const consultantStats = (consultantProfiles || []).map(c => {
            const consultantSurveys = (surveys || []).filter(s => s.consultant_id === c.id)
            const consultantScores = consultantSurveys.map(s => s.satisfaction_score).filter(Boolean) as number[]
            const avg = consultantScores.length > 0
                ? Math.round((consultantScores.reduce((a, b) => a + b, 0) / consultantScores.length) * 10) / 10
                : 0

            return {
                id: c.id,
                name: c.full_name || 'Unknown',
                avgScore: avg,
                totalSessions: consultantSurveys.length,
                flagged: consultantSurveys.filter(s => s.flagged).length,
            }
        }).sort((a, b) => b.avgScore - a.avgScore)

        setConsultants(consultantStats)
        setLoading(false)
    }

    async function resolveAlert(alertId: string) {
        await fetch('/api/alerts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alert_id: alertId, resolved: true }),
        })
        loadData()
    }

    const getScoreColor = (score: number) => {
        if (score >= 7) return 'text-emerald-600'
        if (score >= 5) return 'text-amber-600'
        return 'text-red-600'
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

    const unresolvedAlerts = alerts.filter(a => !a.resolved)

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Shield size={24} className="text-violet-600" />
                    Platform Overview
                </h1>
                <p className="text-gray-500 mt-1">Monitor platform quality and consultant performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
                    <p className="text-sm font-medium opacity-80">Platform Score</p>
                    <p className="text-4xl font-bold mt-1">{stats.avgScore}<span className="text-lg opacity-60">/10</span></p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BarChart3 size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalSessions}</p>
                            <p className="text-sm text-gray-500">Total Sessions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.activeAlerts > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                            <AlertTriangle size={18} className={stats.activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600'} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.activeAlerts}</p>
                            <p className="text-sm text-gray-500">Active Alerts</p>
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
                            <p className="text-sm text-gray-500">Surveys Collected</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Satisfaction Trend
                    </h3>
                    {trendData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                        }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                            No trend data yet
                        </div>
                    )}
                </div>

                {/* Active Alerts */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Active Alerts</h3>
                        {unresolvedAlerts.length > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                {unresolvedAlerts.length}
                            </span>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {unresolvedAlerts.length === 0 ? (
                            <div className="p-6 text-center">
                                <CheckCircle size={24} className="mx-auto text-emerald-400 mb-2" />
                                <p className="text-sm text-gray-500">All clear! No active alerts</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {unresolvedAlerts.map(alert => (
                                    <div key={alert.id} className="p-4">
                                        <p className="text-sm text-gray-900 font-medium mb-1">
                                            {(alert as any).consultant?.full_name || 'Consultant'}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-2">{alert.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {new Date(alert.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <button
                                                onClick={() => resolveAlert(alert.id)}
                                                className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                                            >
                                                Mark Resolved
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Consultant Leaderboard */}
            <div className="bg-white rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users size={18} className="text-indigo-600" />
                        Consultant Leaderboard
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3 font-medium">Rank</th>
                                <th className="px-6 py-3 font-medium">Consultant</th>
                                <th className="px-6 py-3 font-medium">Avg Score</th>
                                <th className="px-6 py-3 font-medium">Sessions</th>
                                <th className="px-6 py-3 font-medium">Flagged</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {consultants.map((consultant, i) => (
                                <tr key={consultant.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' :
                                                i === 1 ? 'bg-gray-100 text-gray-600' :
                                                    'bg-gray-50 text-gray-400'
                                            }`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{consultant.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-semibold ${getScoreColor(consultant.avgScore)}`}>
                                            {consultant.avgScore}/10
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{consultant.totalSessions}</td>
                                    <td className="px-6 py-4">
                                        {consultant.flagged > 0 ? (
                                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                                {consultant.flagged}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400">0</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
