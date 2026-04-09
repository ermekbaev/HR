import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await req.json()

  const completion = await prisma.surveyCompletion.upsert({
    where: { surveyId_userId: { surveyId: id, userId } },
    update: {},
    create: { surveyId: id, userId }
  })

  return NextResponse.json(completion, { status: 201 })
}
