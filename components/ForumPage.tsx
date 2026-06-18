'use client'

import { FormEvent, useEffect, useState } from 'react'

// ─── Typen ────────────────────────────────────────────────────────────────────

type Category =
  | 'NAGGING'
  | 'ROACH_MOTEL'
  | 'HIDDEN_COSTS'
  | 'FORCED_CONTINUITY'
  | 'TRICK_QUESTIONS'
  | 'DISGUISED_ADS'
  | 'COUNTDOWN'
  | 'CONFIRM_SHAMING'
  | 'SONSTIGES'

type Reply = {
  id: number
  postId: number
  author: string
  content: string
  createdAt: string
}

type ForumPost = {
  id: number
  author: string
  title: string
  content: string
  website: string | null
  category: Category
  createdAt: string
  replies: Reply[]
}

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Category, string> = {
  NAGGING:          'Nagging',
  ROACH_MOTEL:      'Roach Motel',
  HIDDEN_COSTS:     'Hidden Costs',
  FORCED_CONTINUITY:'Forced Continuity',
  TRICK_QUESTIONS:  'Trick Questions',
  DISGUISED_ADS:    'Disguised Ads',
  COUNTDOWN:        'Countdown / Scarcity',
  CONFIRM_SHAMING:  'Confirmshaming',
  SONSTIGES:        'Sonstiges',
}

// Jede Kategorie bekommt eine eigene Farbe (passend zum dunklen Design)
const CATEGORY_COLORS: Record<Category, string> = {
  NAGGING:           'bg-purple-700/60 text-purple-200',
  ROACH_MOTEL:       'bg-red-800/60 text-red-200',
  HIDDEN_COSTS:      'bg-yellow-700/60 text-yellow-200',
  FORCED_CONTINUITY: 'bg-orange-700/60 text-orange-200',
  TRICK_QUESTIONS:   'bg-blue-700/60 text-blue-200',
  DISGUISED_ADS:     'bg-green-800/60 text-green-200',
  COUNTDOWN:         'bg-pink-700/60 text-pink-200',
  CONFIRM_SHAMING:   'bg-teal-700/60 text-teal-200',
  SONSTIGES:         'bg-gray-600/60 text-gray-200',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function ForumPage() {
  const [posts, setPosts]             = useState<ForumPost[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [filterCat, setFilterCat]     = useState<Category | 'ALL'>('ALL')
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)

  // Neuer Post – Formularfelder
  const [npAuthor,   setNpAuthor]   = useState('')
  const [npTitle,    setNpTitle]    = useState('')
  const [npContent,  setNpContent]  = useState('')
  const [npWebsite,  setNpWebsite]  = useState('')
  const [npCategory, setNpCategory] = useState<Category>('SONSTIGES')
  const [npSubmitting, setNpSubmitting] = useState(false)

  // Reply – pro Post eigene State-Map
  const [replyAuthor,  setReplyAuthor]  = useState<Record<number, string>>({})
  const [replyContent, setReplyContent] = useState<Record<number, string>>({})
  const [replySubmitting, setReplySubmitting] = useState<Record<number, boolean>>({})

  // ── Laden ────────────────────────────────────────────────────────────────

  async function loadPosts() {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/forum/posts')
      if (!res.ok) throw new Error()
      setPosts(await res.json())
    } catch {
      setError('Beiträge konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  // ── Neuer Post ────────────────────────────────────────────────────────────

  async function handleNewPost(e: FormEvent) {
    e.preventDefault()
    setNpSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: npAuthor, title: npTitle,
          content: npContent, website: npWebsite,
          category: npCategory,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Fehler beim Speichern.')
      }
      setNpAuthor(''); setNpTitle(''); setNpContent('')
      setNpWebsite(''); setNpCategory('SONSTIGES')
      setShowNewPost(false)
      await loadPosts()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    } finally {
      setNpSubmitting(false)
    }
  }

  // ── Reply ─────────────────────────────────────────────────────────────────

  async function handleReply(e: FormEvent, postId: number) {
    e.preventDefault()
    setReplySubmitting(prev => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/forum/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author:  replyAuthor[postId]  || '',
          content: replyContent[postId] || '',
        }),
      })
      if (!res.ok) throw new Error()
      setReplyAuthor(prev  => ({ ...prev,  [postId]: '' }))
      setReplyContent(prev => ({ ...prev, [postId]: '' }))
      await loadPosts()
    } catch {
      setError('Antwort konnte nicht gespeichert werden.')
    } finally {
      setReplySubmitting(prev => ({ ...prev, [postId]: false }))
    }
  }

  // ── Gefilterte Posts ──────────────────────────────────────────────────────

  const visiblePosts = filterCat === 'ALL'
    ? posts
    : posts.filter(p => p.category === filterCat)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="min-h-screen py-20 px-4 md:px-12 font-sans text-white">

      {/* Titel */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-space_grotesk)' }}>
          Community Forum
        </h2>
        <p className="text-gray-300 text-lg">
          Teilt eure Erfahrungen mit Dark Patterns. Welche Websites fallen euch auf?
        </p>
      </div>

      {/* Aktionsleiste */}
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setShowNewPost(v => !v)}
          className="px-5 py-2 rounded-lg bg-[#5227FF] hover:bg-[#6b3fff] transition-colors font-semibold"
        >
          {showNewPost ? '✕ Abbrechen' : '+ Neuer Beitrag'}
        </button>

        {/* Kategorie-Filter */}
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as Category | 'ALL')}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
        >
          <option value="ALL">Alle Kategorien</option>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>

        <span className="ml-auto text-sm text-gray-400">
          {visiblePosts.length} {visiblePosts.length === 1 ? 'Beitrag' : 'Beiträge'}
        </span>
      </div>

      {/* Neuer Beitrag Formular */}
      {showNewPost && (
        <div className="max-w-4xl mx-auto mb-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
          <h3 className="text-xl font-bold mb-5">Neuen Beitrag erstellen</h3>
          <form onSubmit={handleNewPost} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Dein Name *</label>
                <input
                  value={npAuthor}
                  onChange={e => setNpAuthor(e.target.value)}
                  required
                  placeholder="z.B. Max Mustermann"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Betroffene Website</label>
                <input
                  value={npWebsite}
                  onChange={e => setNpWebsite(e.target.value)}
                  placeholder="z.B. Amazon, Netflix, Zalando..."
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Titel *</label>
                <input
                  value={npTitle}
                  onChange={e => setNpTitle(e.target.value)}
                  required
                  placeholder="Kurz & prägnant beschreiben"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Dark Pattern Kategorie *</label>
                <select
                  value={npCategory}
                  onChange={e => setNpCategory(e.target.value as Category)}
                  required
                  className="w-full rounded-lg bg-[#202532] border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
                >
                  {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Beschreibung *</label>
              <textarea
                value={npContent}
                onChange={e => setNpContent(e.target.value)}
                required
                rows={4}
                placeholder="Beschreibe das Dark Pattern so genau wie möglich. Was hast du erlebt? Wo? Wie hat es dich beeinflusst?"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={npSubmitting}
              className="px-6 py-2 rounded-lg bg-[#5227FF] hover:bg-[#6b3fff] disabled:opacity-50 transition-colors font-semibold"
            >
              {npSubmitting ? 'Wird gespeichert...' : 'Beitrag veröffentlichen'}
            </button>
          </form>
        </div>
      )}

      {/* Fehlermeldung */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      {/* Post-Liste */}
      <div className="max-w-4xl mx-auto space-y-5">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Lade Beiträge...</div>
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10 text-gray-400">
            <p className="text-lg">Noch keine Beiträge in dieser Kategorie.</p>
            <p className="text-sm mt-1">Sei die Erste, teile deine Erfahrung!</p>
          </div>
        ) : (
          visiblePosts.map(post => {
            const isOpen = expandedPost === post.id

            return (
              <div
                key={post.id}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden transition-all"
              >
                {/* Post Header – immer sichtbar */}
                <button
                  className="w-full text-left p-5 hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedPost(isOpen ? null : post.id)}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category]}`}>
                          {CATEGORY_LABELS[post.category]}
                        </span>
                        {post.website && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#536E91]/60 text-blue-200">
                            {post.website}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">{post.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        von <span className="text-[#B79864] font-medium">{post.author}</span>
                        {' · '}{formatDate(post.createdAt)}
                        {' · '}{post.replies.length} {post.replies.length === 1 ? 'Antwort' : 'Antworten'}
                      </p>
                    </div>
                    <span className="text-gray-500 text-lg">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Post Body – nur wenn aufgeklappt */}
                {isOpen && (
                  <div className="border-t border-white/10 px-5 pb-5">
                    {/* Inhalt */}
                    <p className="py-4 text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>

                    {/* Replies */}
                    {post.replies.length > 0 && (
                      <div className="mb-5 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                          Antworten ({post.replies.length})
                        </h4>
                        {post.replies.map(reply => (
                          <div
                            key={reply.id}
                            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                          >
                            <p className="text-sm font-medium text-[#B79864] mb-1">
                              {reply.author}
                              <span className="text-gray-500 font-normal ml-2">{formatDate(reply.createdAt)}</span>
                            </p>
                            <p className="text-gray-200 text-sm whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Formular */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Antworten
                      </h4>
                      <form onSubmit={e => handleReply(e, post.id)} className="space-y-3">
                        <input
                          value={replyAuthor[post.id] || ''}
                          onChange={e => setReplyAuthor(prev => ({ ...prev, [post.id]: e.target.value }))}
                          required
                          placeholder="Dein Name"
                          className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF]"
                        />
                        <textarea
                          value={replyContent[post.id] || ''}
                          onChange={e => setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                          required
                          rows={3}
                          placeholder="Deine Antwort..."
                          className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5227FF] resize-none"
                        />
                        <button
                          type="submit"
                          disabled={replySubmitting[post.id]}
                          className="px-4 py-2 rounded-lg bg-[#536E91] hover:bg-[#5f7fa8] disabled:opacity-50 transition-colors text-sm font-semibold"
                        >
                          {replySubmitting[post.id] ? 'Wird gespeichert...' : 'Antwort senden'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
