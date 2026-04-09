import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(candidates)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const candidate = await prisma.candidate.create({ data })
  return NextResponse.json(candidate, { status: 201 })
}
