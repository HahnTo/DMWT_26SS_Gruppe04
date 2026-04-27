import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const author = body.author?.trim()
    const text = body.text?.trim()

    if (!author || !text) {
      return NextResponse.json(
        { error: 'Author and text are required.' },
        { status: 400 }
      )
    }

    const created = await prisma.comment.create({
      data: { author, text },
    })

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }
}