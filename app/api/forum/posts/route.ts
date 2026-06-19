import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Category } from '@prisma/client'

// Alle Posts laden (inkl. Anzahl der Replies)
export async function GET() {
  const posts = await prisma.forumPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      replies: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  return NextResponse.json(posts)
}

// Neuen Post erstellen
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const author   = body.author?.trim()
    const title    = body.title?.trim()
    const content  = body.content?.trim().replace(/\s+/g, ' ');
    const website  = body.website?.trim() || null
    const category = body.category as Category

    if (!author || !title || !content || !category) {
      return NextResponse.json(
        { error: 'Autor, Titel, Inhalt und Kategorie sind Pflichtfelder.' },
        { status: 400 }
      )
    }

    // Prüfen ob die Kategorie gültig ist
    if (!Object.values(Category).includes(category)) {
      return NextResponse.json(
        { error: 'Ungültige Kategorie.' },
        { status: 400 }
      )
    }

    const post = await prisma.forumPost.create({
      data: { author, title, content, website, category },
      include: { replies: true },
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Ungültiger Request-Body.' },
      { status: 400 }
    )
  }
}
