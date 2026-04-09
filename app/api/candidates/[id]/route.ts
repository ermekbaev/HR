import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const candidate = await prisma.candidate.update({
    where: { id },
    data
  })
  return NextResponse.json(candidate)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.candidate.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
