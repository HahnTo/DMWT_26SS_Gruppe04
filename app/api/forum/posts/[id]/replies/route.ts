import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Antwort auf einen bestimmten Post erstellen
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Ungültige Post-ID.' }, { status: 400 })
    }

    const body = await request.json()
    const author  = body.author?.trim()
    const content = body.content?.trim()

    if (!author || !content) {
      return NextResponse.json(
        { error: 'Autor und Inhalt sind Pflichtfelder.' },
        { status: 400 }
      )
    }

    // Prüfen ob der Post existiert
    const post = await prisma.forumPost.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: 'Post nicht gefunden.' }, { status: 404 })
    }

    const reply = await prisma.forumReply.create({
      data: { postId, author, content },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Ungültiger Request-Body.' },
      { status: 400 }
    )
  }
}
