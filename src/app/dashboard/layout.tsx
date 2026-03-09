'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Profile, UserRole } from '@/lib/types'
import {
    LayoutDashboard,
    MessageSquare,
    History,
    BarChart3,
    Users,
    AlertTriangle,
    Shield,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react'

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
    candidate: [
        { label: 'Dashboard', href: '/dashboard/candidate', icon: <LayoutDashboard size={18} /> },
        { label: 'Survey History', href: '/dashboard/candidate/history', icon: <History size={18} /> },
    ],
    hr_consultant: [
        { label: 'Dashboard', href: '/dashboard/consultant', icon: <LayoutDashboard size={18} /> },
        { label: 'Sessions', href: '/dashboard/consultant/sessions', icon: <MessageSquare size={18} /> },
    ],
    super_admin: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard size={18} /> },
        { label: 'Alerts', href: '/dashboard/admin/alerts', icon: <AlertTriangle size={18} /> },
        { label: 'Consultants', href: '/dashboard/admin/consultants', icon: <Users size={18} /> },
    ],
    licensing: [
        { label: 'Dashboard', href: '/dashboard/licensing', icon: <LayoutDashboard size={18} /> },
    ],
}

const ROLE_LABELS: Record<UserRole, string> = {
    candidate: 'Candidate',
    hr_consultant: 'HR Consultant',
    super_admin: 'Super Admin',
    licensing: 'Licensing',
}

const ROLE_COLORS: Record<UserRole, string> = {
    candidate: 'bg-blue-100 text-blue-700',
    hr_consultant: 'bg-emerald-100 text-emerald-700',
    super_admin: 'bg-violet-100 text-violet-700',
    licensing: 'bg-amber-100 text-amber-700',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data as Profile)
            }
            setLoading(false)
        }

        loadProfile()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Loading...</span>
                </div>
            </div>
        )
    }

    if (!profile) return null

    const navItems = NAV_ITEMS[profile.role] || []

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JSO</span>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 text-sm">JSO Platform</h2>
                            <p className="text-xs text-gray-500">Candidate Experience</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                    {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
                                </a>
                            )
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="border-t border-gray-100 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{profile.full_name}</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[profile.role]}`}>
                                    {ROLE_LABELS[profile.role]}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[profile.role]}`}>
                            {ROLE_LABELS[profile.role]}
                        </span>
                        <span className="text-sm text-gray-700 font-medium hidden sm:block">
                            {profile.full_name}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
