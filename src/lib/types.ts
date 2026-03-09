export type UserRole = 'candidate' | 'hr_consultant' | 'super_admin' | 'licensing'

export interface Profile {
    id: string
    full_name: string
    role: UserRole
    created_at: string
}

export interface Session {
    id: string
    candidate_id: string
    consultant_id: string
    session_date: string
    status: 'scheduled' | 'completed' | 'cancelled'
    created_at: string
    // Joined fields
    candidate?: Profile
    consultant?: Profile
    survey?: Survey
}

export interface Survey {
    id: string
    session_id: string
    candidate_id: string
    consultant_id: string
    star_rating: number
    comment: string
    ai_sentiment: string | null
    ai_key_issues: string | null
    satisfaction_score: number | null
    flagged: boolean
    created_at: string
    // Joined fields
    session?: Session
    consultant?: Profile
    candidate?: Profile
}

export interface Alert {
    id: string
    survey_id: string
    consultant_id: string
    message: string
    resolved: boolean
    created_at: string
    // Joined fields
    survey?: Survey
    consultant?: Profile
}

export interface AIAnalysisResult {
    sentiment: 'positive' | 'neutral' | 'negative'
    key_issues: string[]
    sentiment_score: number
    summary: string
}
