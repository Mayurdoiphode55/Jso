'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogIn, Eye, EyeOff, Copy, Check } from 'lucide-react'

const DEMO_CREDENTIALS = [
    { role: 'Candidate', email: 'candidate1@jso.demo', password: 'demo123', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { role: 'HR Consultant', email: 'consultant1@jso.demo', password: 'demo123', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { role: 'Super Admin', email: 'admin@jso.demo', password: 'demo123', color: 'bg-violet-50 border-violet-200 text-violet-800' },
    { role: 'Licensing', email: 'licensing@jso.demo', password: 'demo123', color: 'bg-amber-50 border-amber-200 text-amber-800' },
]

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                setError(signInError.message)
                setLoading(false)
                return
            }

            // Redirect to dashboard — middleware handles role-based routing
            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    const fillCredentials = (email: string, password: string) => {
        setEmail(email)
        setPassword(password)
        setError('')
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedEmail(text)
        setTimeout(() => setCopiedEmail(null), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
                        <span className="text-white font-bold text-2xl tracking-tight">JSO</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mt-1">Sign in to the JSO platform</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6">
                    <p className="text-xs text-gray-500 text-center mb-3 uppercase font-medium tracking-wider">Demo Credentials</p>
                    <div className="grid gap-2">
                        {DEMO_CREDENTIALS.map((cred) => (
                            <div
                                key={cred.role}
                                onClick={() => fillCredentials(cred.email, cred.password)}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all hover:shadow-sm cursor-pointer ${cred.color}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">{cred.role}</span>
                                    <span className="opacity-70 text-xs">{cred.email}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard(cred.email)
                                    }}
                                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                                    title="Copy email"
                                >
                                    {copiedEmail === cred.email ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
