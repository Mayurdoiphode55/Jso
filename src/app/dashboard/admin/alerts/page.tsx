'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert } from '@/lib/types'
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react'

export default function AdminAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [tab, setTab] = useState<'unresolved' | 'resolved' | 'all'>('unresolved')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadAlerts()

        const channel = supabase
            .channel('admin-alerts-page')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
                loadAlerts()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    async function loadAlerts() {
        const response = await fetch('/api/alerts')
        if (response.ok) {
            const data = await response.json()
            setAlerts(data.alerts || [])
        }
        setLoading(false)
    }

    async function resolveAlert(alertId: string) {
        await fetch('/api/alerts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alert_id: alertId, resolved: true }),
        })
        loadAlerts()
    }

    const filteredAlerts = alerts.filter(a => {
        if (tab === 'unresolved') return !a.resolved
        if (tab === 'resolved') return a.resolved
        return true
    })

    const parseKeyIssues = (issues: string | null): string[] => {
        if (!issues) return []
        try { return JSON.parse(issues) } catch { return [] }
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48" />
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={24} className="text-amber-600" />
                    Alert Management
                </h1>
                <p className="text-gray-500 mt-1">Review and manage low-satisfaction session alerts</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
                {([
                    { key: 'unresolved', label: 'Unresolved', icon: <Clock size={14} /> },
                    { key: 'resolved', label: 'Resolved', icon: <CheckCircle size={14} /> },
                    { key: 'all', label: 'All', icon: <Filter size={14} /> },
                ] as const).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.icon}
                        {t.label}
                        {t.key === 'unresolved' && alerts.filter(a => !a.resolved).length > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                                {alerts.filter(a => !a.resolved).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            {filteredAlerts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <CheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
                    <p className="text-gray-500">No alerts in this category</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`bg-white rounded-2xl border p-5 ${alert.resolved ? 'border-gray-200 opacity-70' : 'border-red-200 border-l-4 border-l-red-400'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {(alert as any).consultant?.full_name || 'Consultant'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(alert.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {alert.resolved ? (
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                        Resolved
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{alert.message}</p>

                            {(alert as any).survey && (
                                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Score: <strong className="text-red-600">{(alert as any).survey.satisfaction_score}/10</strong></span>
                                        <span>Rating: {(alert as any).survey.star_rating}/5</span>
                                        <span className={`px-2 py-0.5 rounded-full ${(alert as any).survey.ai_sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {(alert as any).survey.ai_sentiment || 'Pending'}
                                        </span>
                                    </div>
                                    {(alert as any).survey.comment && (
                                        <p className="text-sm text-gray-600 mt-2 italic">&quot;{(alert as any).survey.comment}&quot;</p>
                                    )}
                                </div>
                            )}

                            {!alert.resolved && (
                                <button
                                    onClick={() => resolveAlert(alert.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                                >
                                    <CheckCircle size={16} />
                                    Mark Resolved
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
