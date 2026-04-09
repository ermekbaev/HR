import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const surveys = await prisma.survey.findMany({
    include: { completions: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(surveys)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const survey = await prisma.survey.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      targetAudience: data.targetAudience,
      questions: data.questions,
      frequency: data.frequency,
      createdBy: data.createdBy
    },
    include: { completions: true }
  })
  return NextResponse.json(survey, { status: 201 })
}
