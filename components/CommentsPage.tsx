'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'

type Comment = {
  id: number
  author: string
  text: string
  createdAt: string
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadComments() {
    try {
      setLoading(true)
      setError('')

      // Asynchrone Funktion, deshalb await
      const response = await fetch('/api/comments')
      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()
      setComments(data)
    } catch {
      setError('Could not load comments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text }),
      })

      if (!response.ok) {
        throw new Error('Failed to save comment')
      }

      setAuthor('')
      setText('')
      await loadComments()
    } catch {
      setError('Could not save comment.')
    }
  }

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Comments</h1>

      <p className="mb-6">
        <Link href="/" className="text-blue-600 underline">
          Back to home
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mb-8 max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add comment
        </button>
      </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded border p-4">
              <strong>{comment.author}</strong>
              <p className="mt-2">{comment.text}</p>
              <small className="text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}