'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session, Profile, Survey } from '@/lib/types'
import { Calendar, ClipboardCheck, Clock, MessageSquare, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CandidateDashboard() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [sessions, setSessions] = useState<(Session & { consultant: Profile; survey: Survey | null })[]>([])
    const [stats, setStats] = useState({ total: 0, surveyed: 0, upcoming: 0 })
    const [loading, setLoading] = useState(true)
    const [simulating, setSimulating] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        loadData()
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

        // Get sessions with consultant info
        const { data: sessionsData } = await supabase
            .from('sessions')
            .select('*, consultant:profiles!sessions_consultant_id_fkey(id, full_name, role)')
            .eq('candidate_id', user.id)
            .order('session_date', { ascending: false })

        // Get surveys for this candidate
        const { data: surveysData } = await supabase
            .from('surveys')
            .select('*')
            .eq('candidate_id', user.id)

        const surveyMap = new Map(surveysData?.map(s => [s.session_id, s]) || [])

        const enriched = (sessionsData || []).map(s => ({
            ...s,
            survey: surveyMap.get(s.id) || null,
        }))

        setSessions(enriched)
        setStats({
            total: enriched.length,
            surveyed: enriched.filter(s => s.survey).length,
            upcoming: enriched.filter(s => s.status === 'scheduled').length,
        })
        setLoading(false)
    }

    async function simulateSession() {
        setSimulating(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get a random consultant
        const { data: consultants } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'hr_consultant')
            .limit(1)

        if (!consultants?.length) {
            setSimulating(false)
            return
        }

        // Create a completed session
        const { data: newSession } = await supabase
            .from('sessions')
            .insert({
                candidate_id: user.id,
                consultant_id: consultants[0].id,
                session_date: new Date().toISOString(),
                status: 'completed',
            })
            .select('*')
            .single()

        if (newSession) {
            await loadData()
            setSimulating(false)
            // Redirect to survey immediately
            window.location.href = `/dashboard/candidate/survey/${newSession.id}`
        } else {
            setSimulating(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
                    ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here&apos;s your consultation overview</p>
                </div>
                <button
                    onClick={simulateSession}
                    disabled={simulating}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 shadow-sm"
                >
                    <Sparkles size={16} />
                    {simulating ? 'Simulating...' : '🎯 Demo: Simulate Session End'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total Sessions</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <ClipboardCheck size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{stats.surveyed}</p>
                        <p className="text-sm text-gray-500">Surveys Completed</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                        <Clock size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
                        <p className="text-sm text-gray-500">Upcoming Sessions</p>
                    </div>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Sessions</h2>
                </div>
                {sessions.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No sessions yet — sessions will appear here after completion</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Consultant</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(session.session_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {session.consultant?.full_name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${session.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : session.status === 'scheduled'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {session.status === 'completed' && !session.survey ? (
                                                <Link
                                                    href={`/dashboard/candidate/survey/${session.id}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Star size={14} />
                                                    Give Feedback
                                                </Link>
                                            ) : session.survey ? (
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={
                                                                i < (session.survey?.star_rating || 0)
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-gray-300'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
