import Link from 'next/link'

export default function HomePage() {
  const demoCredentials = [
    { role: 'Candidate', email: 'candidate1@jso.demo', password: 'demo123', description: 'Submit satisfaction surveys, view feedback history', color: 'border-blue-200 bg-blue-50' },
    { role: 'HR Consultant', email: 'consultant1@jso.demo', password: 'demo123', description: 'View performance metrics, AI-analysed feedback', color: 'border-emerald-200 bg-emerald-50' },
    { role: 'Super Admin', email: 'admin@jso.demo', password: 'demo123', description: 'Platform oversight, alerts, consultant leaderboard', color: 'border-violet-200 bg-violet-50' },
    { role: 'Licensing', email: 'licensing@jso.demo', password: 'demo123', description: 'Aggregate compliance metrics and reports', color: 'border-amber-200 bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl mb-6 shadow-xl shadow-indigo-200">
          <span className="text-white font-bold text-3xl tracking-tight">JSO</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Candidate Experience Agent
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          An AI-powered feedback intelligence system for the JSO career platform. Automatically
          captures post-consultation satisfaction surveys, analyses feedback using Groq LLaMA 3.1,
          and provides real-time quality insights across all four platform dashboards.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-lg font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
        >
          View Demo →
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: '⭐', title: 'AI Survey Analysis', desc: 'Groq LLaMA 3.1 analyses sentiment and extracts key issues from feedback' },
            { icon: '🚨', title: 'Auto Alerts', desc: 'Low scores automatically alert admins with actionable insights' },
            { icon: '📊', title: '4 Dashboards', desc: 'Role-specific views for candidates, consultants, admins, and licensing' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">Demo Credentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {demoCredentials.map((cred) => (
            <div
              key={cred.role}
              className={`rounded-2xl border p-5 ${cred.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{cred.role}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{cred.description}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">Email:</span>
                  <code className="text-xs bg-white/70 px-2 py-1 rounded-md text-gray-800 font-mono">{cred.email}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">Password:</span>
                  <code className="text-xs bg-white/70 px-2 py-1 rounded-md text-gray-800 font-mono">{cred.password}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-400">
          JSO Candidate Experience Agent — AariyaTech Corp Internship Assignment
        </p>
      </footer>
    </div>
  )
}
